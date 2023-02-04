<script setup lang="ts">
import { NTabs, NTabPane } from 'naive-ui';
import PageLayout from '@/components/layout/PageLayout.vue';
import PlanningBoardsTab from '@/views/team-board/parts/PlanningBoardsTab.vue';
import RetroBoardsTab from '@/views/team-board/parts/RetroBoardsTab.vue';
import MembersTab from '@/views/team-board/parts/MembersTab.vue';
import { computed, ref, toRef, watch } from 'vue';
import { useRoute } from 'vue-router';
import { collection, orderBy, query } from '@firebase/firestore';
import { useCollection, useFirestore } from 'vuefire';
import { useMembers } from '@/composables/useMembers';
import type { PlanningBoard } from '@/types/PlanningBoard';
import type { RetroBoard } from '@/types/RetroBoard';

const route = useRoute();
const db = useFirestore();

const teamId = computed(() => route.params.teamId as string);

const planningBoardsSource = computed(() => {
  const { teamId } = route.params;
  if (teamId) {
    return query(collection(db, 'teams', teamId as string, 'planning-boards'), orderBy('date', 'desc'));
  }
  return undefined;
});
const { data: planningBoards } = useCollection<PlanningBoard>(planningBoardsSource);

const isPlanningBoardsLoading = ref(true);
watch(planningBoards, () => (isPlanningBoardsLoading.value = false));

const retroBoardsSource = computed(() => {
  const { teamId } = route.params;
  if (teamId) {
    return query(collection(db, 'teams', teamId as string, 'retro-boards'), orderBy('date', 'desc'));
  }
  return undefined;
});
const { data: retroBoards } = useCollection<RetroBoard>(retroBoardsSource);

const isRetroBoardsLoading = ref(true);
watch(retroBoards, () => (isRetroBoardsLoading.value = false));

const { data: members, isLoading: isMembersLoading } = useMembers(teamId);
</script>

<template>
  <page-layout>
    <template #content>
      <n-tabs type="line" animated>
        <n-tab-pane name="planning" tab="Planning">
          <planning-boards-tab :boards="planningBoards" :is-loading="isPlanningBoardsLoading" :members="members" />
        </n-tab-pane>
        <n-tab-pane name="retro" tab="Retro">
          <retro-boards-tab :boards="retroBoards" :is-loading="isRetroBoardsLoading" :members="members" />
        </n-tab-pane>
        <n-tab-pane name="members" tab="Members">
          <members-tab :members="members" :is-loading="isMembersLoading" />
        </n-tab-pane>
      </n-tabs>
    </template>
  </page-layout>
</template>

<style scoped lang="scss"></style>
