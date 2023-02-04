<script setup lang="ts">
import { NList, NListItem, NThing, NEmpty, NButton, NSpace } from 'naive-ui';
import { useFirestore } from 'vuefire';
import type { PlanningBoard } from '@/types/PlanningBoard';
import { useRoute } from 'vue-router';
import { computed, ref, toRef } from 'vue';
import { deleteDoc, doc } from '@firebase/firestore';
import CreatePlanningBoardModal from '@/views/team-board/parts/CreatePlanningBoardModal.vue';
import dayjs from 'dayjs';
import StyledLink from '@/components/styled/StyledLink.vue';
import type { FirebaseEntity } from '@/types/FirebaseEntity';
import SkeletonListItem from '@/components/SkeletonListItem.vue';
import { useTeamAccess } from '@/composables/useTeamAccess';
import type { TeamMember } from '@/types/TeamMember';

const props = defineProps<{
  members: (TeamMember & FirebaseEntity)[];
  boards: (PlanningBoard & FirebaseEntity)[];
  isLoading: boolean;
}>();

const route = useRoute();
const db = useFirestore();

const teamId = computed(() => route.params.teamId as string);

const isModalVisible = ref(false);
const openModal = () => (isModalVisible.value = true);

const removeBoard = async (boardId: string) => {
  const { teamId } = route.params;
  await deleteDoc(doc(db, 'teams', teamId as string, 'planning-boards', boardId));
};

const { hasWriteAccess } = useTeamAccess(toRef(props, 'members'));
</script>

<template>
  <n-list hoverable>
    <template #header v-if="hasWriteAccess">
      <n-space justify="end" align="center">
        <n-button @click="openModal" type="primary">Create board</n-button>
      </n-space>
    </template>
    <template v-if="isLoading">
      <skeleton-list-item v-for="n in 3" :key="n" />
    </template>
    <template v-else-if="boards?.length">
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
            <n-button @click="removeBoard(board.id)" text v-if="hasWriteAccess">Remove</n-button>
          </n-space>
        </template>
      </n-list-item>
    </template>
    <template v-else>
      <n-list-item>
        <n-empty description="No boards found">
          <template #extra>
            <n-button size="small" @click="openModal"> Create new board </n-button>
          </template>
        </n-empty>
      </n-list-item>
    </template>
  </n-list>
  <create-planning-board-modal v-model:is-visible="isModalVisible" :team-id="teamId" />
</template>

<style scoped lang="scss"></style>
