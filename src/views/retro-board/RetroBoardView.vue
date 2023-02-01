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
  NGrid,
  NGridItem,
  NInput,
  NSwitch,
  NCountdown,
} from 'naive-ui';
import { Eye as EyeIcon, EyeOff as EyeOffIcon } from '@vicons/ionicons5';
import { computed, watch, ref } from 'vue';
import { collection, doc, getDoc, orderBy, query, setDoc, Timestamp, updateDoc, where } from '@firebase/firestore';
import BoardCard from '@/views/retro-board/parts/BoardCard.vue';
import type { PlanningBoard } from '@/types/PlanningBoard';
import type { PlanningBoardTicket } from '@/types/PlanningBoardTicket';
import type { PlanningBoardActiveUser } from '@/types/PlanningBoardActiveUser';
import dayjs from 'dayjs';
import type { RetroBoard } from '@/types/RetroBoard';
import type { RetroBoardCard } from '@/types/RetroBoardCard';
import type { RetroBoardCardType } from '@/types/RetroBoardCardType';

const route = useRoute();
const db = useFirestore();
const user = useCurrentUser();

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

const wentWellCards = computed(() => cards.value.filter((card) => card.type === 'went-well'));
const toImproveCards = computed(() => cards.value.filter((card) => card.type === 'to-improve'));
const actionableCards = computed(() => cards.value.filter((card) => card.type === 'actionable'));

const teamId = computed(() => route.params.teamId as string);
const boardId = computed(() => route.params.boardId as string);

const toggleVisiblity = async () => {
  await updateDoc(doc(db, 'teams', teamId.value, 'retro-boards', boardId.value), {
    revealed: !board.value?.revealed,
  });
};
</script>

<template>
  <page-layout>
    <template #content>
      <n-space justify="space-between" align="center" style="padding: 12px 0 24px">
        <n-h1>
          <n-text>{{ board?.name ?? 'Board title' }}</n-text>
        </n-h1>
        <n-button :type="board?.revealed ? 'default' : 'primary'" @click="toggleVisiblity">
          {{ board?.revealed ? 'Hid cards' : 'Reveal cards' }}
          <template #icon>
            <n-icon>
              <eye-icon v-if="!board?.revealed" />
              <eye-off-icon v-else />
            </n-icon>
          </template>
        </n-button>
      </n-space>
      <n-grid cols="3" :x-gap="18">
        <n-grid-item class="column">
          <n-list hoverable>
            <template #header>
              <n-h3 prefix="bar">
                <n-text type="success">Went well</n-text>
              </n-h3>
            </template>
            <n-list-item>
              <board-card type="went-well" :team-id="teamId" :board-id="boardId" :revealed="!!board?.revealed" />
            </n-list-item>
            <n-list-item v-for="card in wentWellCards" :key="card.id">
              <board-card
                :data="card"
                :type="card.type"
                :team-id="teamId"
                :board-id="boardId"
                :revealed="!!board?.revealed"
              />
            </n-list-item>
          </n-list>
        </n-grid-item>
        <n-grid-item>
          <n-list hoverable>
            <template #header>
              <n-h3 prefix="bar" type="error">
                <n-text type="error">To improve</n-text>
              </n-h3>
            </template>
            <n-list-item>
              <board-card type="to-improve" :team-id="teamId" :board-id="boardId" :revealed="!!board?.revealed" />
            </n-list-item>
            <n-list-item v-for="card in toImproveCards" :key="card.id">
              <board-card
                :data="card"
                :type="card.type"
                :team-id="teamId"
                :board-id="boardId"
                :revealed="!!board?.revealed"
              />
            </n-list-item>
          </n-list>
        </n-grid-item>
        <n-grid-item>
          <n-list hoverable>
            <template #header>
              <n-h3 prefix="bar" type="info">
                <n-text type="info">Actionables</n-text>
              </n-h3>
            </template>
            <n-list-item>
              <board-card type="actionable" :team-id="teamId" :board-id="boardId" :revealed="!!board?.revealed" />
            </n-list-item>
            <n-list-item v-for="card in actionableCards" :key="card.id">
              <board-card
                :data="card"
                :type="card.type"
                :team-id="teamId"
                :board-id="boardId"
                :revealed="!!board?.revealed"
              />
            </n-list-item>
          </n-list>
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

.cards-list {
  padding: 8px;
}
</style>
