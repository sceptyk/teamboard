<script setup lang="ts">
import { NList, NListItem, NThing, NEmpty, NButton, NSpace } from 'naive-ui';
import { useCollection, useFirestore } from 'vuefire';
import type { PlanningBoard } from '@/types/PlanningBoard';
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';
import { collection, deleteDoc, doc, orderBy, query } from '@firebase/firestore';
import CreatePlanningBoardModal from '@/views/team-board/parts/CreatePlanningBoardModal.vue';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/LocalizedFormat';
import StyledLink from '@/components/ui/StyledLink.vue';

dayjs.extend(LocalizedFormat);

const route = useRoute();
const db = useFirestore();

const teamId = computed(() => route.params.teamId as string);

const source = computed(() => {
  const { teamId } = route.params;
  if (teamId) {
    return query(collection(db, 'teams', teamId as string, 'planning-boards'), orderBy('date', 'desc'));
  }
  return undefined;
});
const { data: boards } = useCollection<PlanningBoard>(source);

const isModalVisible = ref(false);
const openModal = () => (isModalVisible.value = true);

const removeBoard = async (boardId: string) => {
  const { teamId } = route.params;
  await deleteDoc(doc(db, 'teams', teamId as string, 'planning-boards', boardId));
};
</script>

<template>
  <n-list v-if="boards.length" hoverable>
    <template #header>
      <n-space justify="end" align="center">
        <n-button @click="openModal" type="primary">Create board</n-button>
      </n-space>
    </template>
    <n-list-item v-for="board in boards" :key="board.id">
      <n-thing :title="board.name"> Created: {{ dayjs(board.date.toDate()).format('L') }} </n-thing>
      <template #suffix>
        <n-space justify="space-between" :wrap="false">
          <styled-link
            :to="{
              name: 'PlanningBoard',
              params: { teamId, boardId: board.id },
            }"
            >Open</styled-link
          >
          <n-button @click="removeBoard(board.id)" text>Remove</n-button>
        </n-space>
      </template>
    </n-list-item>
  </n-list>
  <n-empty v-else description="No boards found">
    <template #extra>
      <n-button size="small" @click="openModal"> Create new board </n-button>
    </template>
  </n-empty>
  <create-planning-board-modal v-model:is-visible="isModalVisible" :team-id="teamId" />
</template>

<style scoped lang="scss"></style>
