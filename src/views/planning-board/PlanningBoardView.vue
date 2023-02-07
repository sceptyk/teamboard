<script setup lang="ts">
import PageLayout from '@/components/layout/PageLayout.vue';
import PageContent from '@/components/layout/PageContent.vue';
import { useRoute } from 'vue-router';
import { useCollection, useCurrentUser, useDocument, useFirestore } from 'vuefire';
import {
  NList,
  NListItem,
  NThing,
  NH1,
  NH2,
  NH3,
  NText,
  NSpace,
  NRadioGroup,
  NRadioButton,
  NRadio,
  NEmpty,
  NStatistic,
  NButton,
  NIcon,
  NTag,
  NSkeleton,
} from 'naive-ui';
import {
  Eye as EyeIcon,
  EllipsisHorizontal as EllipsisHorizontalIcon,
  Checkmark as CheckmarkIcon,
} from '@vicons/ionicons5';
import { computed, watch, ref } from 'vue';
import { collection, doc, getDoc, orderBy, query, setDoc, Timestamp, updateDoc, where } from '@firebase/firestore';
import CreateTicketInline from '@/views/planning-board/parts/CreateTicketInline.vue';
import type { PlanningBoard } from '@/types/PlanningBoard';
import type { PlanningBoardTicket } from '@/types/PlanningBoardTicket';
import type { PlanningBoardActiveUser } from '@/types/PlanningBoardActiveUser';
import dayjs from 'dayjs';
import ShareLinkButton from '@/components/ShareLinkButton.vue';
import { useMembers } from '@/composables/useMembers';
import { useTeamAccess } from '@/composables/useTeamAccess';

const route = useRoute();
const db = useFirestore();
const user = useCurrentUser();

watch(
  [user, route],
  async () => {
    const { teamId, boardId } = route.params;
    if (user.value && teamId && boardId) {
      const userObject = await getDoc(doc(db, 'users', user.value.uid));

      const activeCurrentUser: PlanningBoardActiveUser = {
        id: user.value.uid,
        name: userObject.data()?.name,
        lastSeen: Timestamp.fromDate(new Date()),
      };
      await setDoc(
        doc(db, 'teams', teamId as string, 'planning-boards', boardId as string, 'active-users', user.value.uid),
        activeCurrentUser,
      );
    }
  },
  { immediate: true },
);

const boardSource = computed(() => {
  const { teamId, boardId } = route.params;
  if (teamId && boardId) {
    return doc(db, 'teams', teamId as string, 'planning-boards', boardId as string);
  }
  return undefined;
});
const { data: board } = useDocument<PlanningBoard>(boardSource);

const activeUsersSource = computed(() => {
  const { teamId, boardId } = route.params;
  if (teamId && boardId) {
    return query(
      collection(db, 'teams', teamId as string, 'planning-boards', boardId as string, 'active-users'),
      where('lastSeen', '>', Timestamp.fromDate(dayjs().subtract(8, 'hour').toDate())),
    );
  }
  return undefined;
});
const { data: activeUsers } = useCollection(activeUsersSource);

const ticketsSource = computed(() => {
  const { teamId, boardId } = route.params;
  if (teamId && boardId) {
    return query(
      collection(db, 'teams', teamId as string, 'planning-boards', boardId as string, 'tickets'),
      orderBy('date', 'desc'),
    );
  }
  return undefined;
});
const { data: tickets } = useCollection<PlanningBoardTicket>(ticketsSource);

const isTicketsLoading = ref(true);
watch(tickets, () => (isTicketsLoading.value = false));

const activeTicket = computed(() => {
  if (board.value?.activeTicket) {
    return tickets.value?.find(({ id }) => id === board.value?.activeTicket);
  }
  return undefined;
});

watch(activeTicket, () => {
  selectedVote.value = '';
});

const voteValues = ['1', '2', '3', '5', '8', '13', '?'];
const selectedVote = ref<string | undefined>();

const selectActiveTicket = async (ticketId: string | null) => {
  if (hasWriteAccess.value) {
    const { teamId, boardId } = route.params;
    await updateDoc(doc(db, 'teams', teamId as string, 'planning-boards', boardId as string), {
      activeTicket: ticketId,
    });
  }
};

const selectEstimate = async (value: string) => {
  const { teamId, boardId } = route.params;
  if (user.value && activeTicket.value) {
    const userId = user.value.uid;
    await updateDoc(doc(db, 'teams', teamId as string, 'planning-boards', boardId as string, 'active-users', userId), {
      estimate: {
        ticket: activeTicket.value.id,
        value,
      },
    });
  }
};

const revealEstimates = async () => {
  const { teamId, boardId } = route.params;
  if (activeTicket.value) {
    const ticketId = activeTicket.value.id;
    await updateDoc(doc(db, 'teams', teamId as string, 'planning-boards', boardId as string, 'tickets', ticketId), {
      revealed: true,
    });
  }
};

const createTicketInlineRef = ref();
const acceptEstimate = async () => {
  const { teamId, boardId } = route.params;
  if (activeTicket.value) {
    const ticketId = activeTicket.value.id;
    await updateDoc(doc(db, 'teams', teamId as string, 'planning-boards', boardId as string, 'tickets', ticketId), {
      estimate: averageEstimate.value,
    });
    await selectActiveTicket(null);
  }
  createTicketInlineRef.value.inputRef.focus();
};

const averageEstimate = computed(() => {
  if (activeTicket.value?.revealed) {
    const estimateValues = activeUsers.value
      .map((user) => user.estimate?.value)
      .filter((value) => value && !isNaN(value));

    return estimateValues.reduce((prev, curr) => parseInt(curr) + prev, 0) / estimateValues.length;
  }
  return '-';
});

const breadcrumbs = computed(() => {
  const { teamId } = route.params;
  return [{ title: 'Team', route: { name: 'TeamBoard', params: { teamId } } }, { title: 'Planning board' }];
});

const teamId = computed(() => route.params.teamId as string);
const { data: members } = useMembers(teamId);
const { hasWriteAccess } = useTeamAccess(members);
</script>

<template>
  <page-layout :breadcrumbs="breadcrumbs">
    <template #main>
      <page-content>
        <template #sider>
          <n-space vertical>
            <n-h3>
              <n-text>Tickets</n-text>
            </n-h3>
            <create-ticket-inline
              v-if="hasWriteAccess"
              ref="createTicketInlineRef"
              :team-id="($route.params.teamId as string)"
              :board-id="($route.params.boardId as string)"
            />
            <n-list v-if="tickets?.length || isTicketsLoading" hoverable :clickable="hasWriteAccess">
              <template v-if="isTicketsLoading">
                <n-list-item v-for="n in 5" :key="n">
                  <n-space>
                    <n-skeleton width="40px" />
                    <n-skeleton width="120px" />
                  </n-space>
                </n-list-item>
              </template>
              <template v-else>
                <n-list-item v-for="ticket in tickets" :key="ticket.id" @click="selectActiveTicket(ticket.id)">
                  <template #prefix>
                    <n-radio
                      :checked="ticket.estimate != null || ticket.id === activeTicket?.id"
                      :disabled="ticket.estimate != null"
                    />
                  </template>
                  <n-thing :title="ticket.title" :title-extra="ticket.estimate ? `${ticket.estimate} points` : ''" />
                </n-list-item>
              </template>
            </n-list>
            <n-space justify="center" v-else>
              <n-empty />
            </n-space>
          </n-space>
        </template>
        <template #content>
          <n-space justify="space-between" align="center" style="margin-bottom: 24px">
            <n-h1>
              <n-text>{{ board?.name ?? 'Board title' }}</n-text>
            </n-h1>
            <share-link-button />
          </n-space>
          <n-h2 prefix="bar">
            <n-text>{{ activeTicket?.title ?? 'No selected ticket' }}</n-text>
          </n-h2>
          <n-space vertical>
            <n-space justify="space-around" align="center">
              <n-radio-group v-model:value="selectedVote" @update:value="selectEstimate">
                <n-radio-button
                  v-for="voteValue in voteValues"
                  :key="voteValue"
                  :value="voteValue"
                  :label="voteValue"
                />
              </n-radio-group>
              <n-statistic label="Estimate average">
                {{ averageEstimate }}
              </n-statistic>
            </n-space>
            <n-list hoverable>
              <template #header>
                <n-space justify="space-between">
                  <n-h3 style="margin: 0">
                    <n-text>Active users</n-text>
                  </n-h3>
                  <template v-if="hasWriteAccess">
                    <n-button
                      v-if="!activeTicket?.revealed"
                      :disabled="!activeTicket"
                      type="default"
                      @click="revealEstimates"
                    >
                      <template #icon>
                        <n-icon>
                          <eye-icon />
                        </n-icon> </template
                      >Show</n-button
                    >
                    <n-button v-else ghost type="primary" @click="acceptEstimate">
                      <template #icon>
                        <n-icon>
                          <checkmark-icon />
                        </n-icon> </template
                      >Accept</n-button
                    >
                  </template>
                </n-space>
              </template>
              <n-list-item v-for="user in activeUsers" :key="user.id">
                <n-thing :title="user.name" />
                <template #suffix>
                  <n-tag
                    :type="
                      user.estimate?.ticket === activeTicket?.id && user.estimate?.value != null ? 'success' : 'warning'
                    "
                    size="large"
                    round
                  >
                    <template v-if="!activeTicket?.revealed">
                      <n-icon>
                        <ellipsis-horizontal-icon
                          v-if="
                            (user.estimate?.ticket === activeTicket?.id && !user.estimate?.value) ||
                            user.estimate?.ticket !== activeTicket?.id
                          "
                        />
                        <checkmark-icon v-else />
                      </n-icon>
                    </template>
                    <template v-else>
                      {{ user.estimate?.value || 0 }}
                    </template>
                  </n-tag>
                </template>
              </n-list-item>
            </n-list>
          </n-space>
        </template>
      </page-content>
    </template>
  </page-layout>
</template>

<style scoped lang="scss"></style>
