<script setup lang="ts">
import PageLayout from '@/components/layout/PageLayout.vue';
import { useRoute } from 'vue-router';
import { useCollection, useDocument, useFirestore } from 'vuefire';
import { NH1, NText, NSpace, NButton, NIcon, NGrid, NGridItem } from 'naive-ui';
import { Eye as EyeIcon, EyeOff as EyeOffIcon } from '@vicons/ionicons5';
import { computed, ref, watch } from 'vue';
import { collection, doc, updateDoc } from '@firebase/firestore';
import BoardColumn from '@/views/retro-board/parts/BoardColumn.vue';
import type { RetroBoard } from '@/types/RetroBoard';
import type { RetroBoardCard } from '@/types/RetroBoardCard';
import ShareLinkButton from '@/components/ShareLinkButton.vue';
import { useMembers } from '@/composables/useMembers';
import { useTeamAccess } from '@/composables/useTeamAccess';

const route = useRoute();
const db = useFirestore();

const boardSource = computed(() => {
  const { teamId, boardId } = route.params;
  if (teamId && boardId) {
    return doc(db, 'teams', teamId as string, 'retro-boards', boardId as string);
  }
  return undefined;
});
const { data: board } = useDocument<RetroBoard>(boardSource);

const cardsSource = computed(() => {
  const { teamId, boardId } = route.params;
  if (teamId && boardId) {
    return collection(db, 'teams', teamId as string, 'retro-boards', boardId as string, 'cards');
  }
  return undefined;
});
const { data: cards } = useCollection<RetroBoardCard>(cardsSource);

const isCardsLoading = ref(true);
watch(cards, () => (isCardsLoading.value = false));

const wentWellCards = computed(() => cards.value.filter((card) => card.type === 'went-well'));
const toImproveCards = computed(() => cards.value.filter((card) => card.type === 'to-improve'));
const actionableCards = computed(() => cards.value.filter((card) => card.type === 'actionable'));

const teamId = computed(() => route.params.teamId as string);
const boardId = computed(() => route.params.boardId as string);

const breadcrumbs = computed(() => {
  return [{ title: 'Team', route: { name: 'TeamBoard', params: { teamId: teamId.value } } }, { title: 'Retro board' }];
});

const toggleVisiblity = async () => {
  await updateDoc(doc(db, 'teams', teamId.value, 'retro-boards', boardId.value), {
    revealed: !board.value?.revealed,
  });
};

const { data: members } = useMembers(teamId);
const { hasWriteAccess } = useTeamAccess(members);
</script>

<template>
  <page-layout :breadcrumbs="breadcrumbs">
    <template #content>
      <n-space justify="space-between" align="center" style="padding: 12px 0 24px">
        <n-h1>
          <n-text>{{ board?.name ?? 'Board title' }}</n-text>
        </n-h1>
        <n-space>
          <share-link-button />
          <n-button v-if="hasWriteAccess" :type="board?.revealed ? 'default' : 'primary'" @click="toggleVisiblity">
            {{ board?.revealed ? 'Hide cards' : 'Reveal cards' }}
            <template #icon>
              <n-icon>
                <eye-icon v-if="!board?.revealed" />
                <eye-off-icon v-else />
              </n-icon>
            </template>
          </n-button>
        </n-space>
      </n-space>
      <n-grid cols="3" :x-gap="18">
        <n-grid-item class="column">
          <board-column
            :team-id="teamId"
            :board-id="boardId"
            :cards="wentWellCards"
            :is-loading="isCardsLoading"
            type="went-well"
            title="Went well"
            :revealed="!!board?.revealed"
          />
        </n-grid-item>
        <n-grid-item class="column">
          <board-column
            :team-id="teamId"
            :board-id="boardId"
            :cards="toImproveCards"
            :is-loading="isCardsLoading"
            type="to-improve"
            title="To improve"
            :revealed="!!board?.revealed"
          />
        </n-grid-item>
        <n-grid-item class="column">
          <board-column
            :team-id="teamId"
            :board-id="boardId"
            :cards="actionableCards"
            :is-loading="isCardsLoading"
            type="actionable"
            title="Actionables"
            :revealed="!!board?.revealed"
          />
        </n-grid-item>
      </n-grid>
    </template>
  </page-layout>
</template>

<style scoped lang="scss">
.no-margin {
  margin: 0;
}

.column {
  height: 100%;
}
</style>
