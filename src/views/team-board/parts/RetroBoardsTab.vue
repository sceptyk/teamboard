<script setup lang="ts">
import { NList, NListItem, NThing, NEmpty, NButton, NSpace } from 'naive-ui';
import { useCollection, useFirestore } from 'vuefire';
import type { PlanningBoard } from '@/types/PlanningBoard';
import { useRoute } from 'vue-router';
import { computed, ref, toRef } from 'vue';
import { collection, deleteDoc, doc, orderBy, query } from '@firebase/firestore';
import CreateRetroBoardModal from '@/views/team-board/parts/CreateRetroBoardModal.vue';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/LocalizedFormat';
import StyledLink from '@/components/styled/StyledLink.vue';
import SkeletonListItem from '@/components/SkeletonListItem.vue';
import type { FirebaseEntity } from '@/types/FirebaseEntity';
import type { RetroBoard } from '@/types/RetroBoard';
import type { TeamMember } from '@/types/TeamMember';
import { useTeamAccess } from '@/composables/useTeamAccess';

dayjs.extend(LocalizedFormat);

const props = defineProps<{
  members: TeamMember[];
  boards: (RetroBoard & FirebaseEntity)[];
  isLoading: boolean;
}>();

const route = useRoute();
const db = useFirestore();

const teamId = computed(() => route.params.teamId as string);

const isModalVisible = ref(false);
const openModal = () => (isModalVisible.value = true);

const removeBoard = async (boardId: string) => {
  await deleteDoc(doc(db, 'teams', teamId.value, 'retro-boards', boardId));
};

const { hasWriteAccess } = useTeamAccess(toRef(props, 'members'));
</script>

<template>
  <n-list v-if="boards.length || isLoading" hoverable>
    <template #header>
      <n-space v-if="hasWriteAccess" justify="end" align="center">
        <n-button @click="openModal" type="primary">Create board</n-button>
      </n-space>
    </template>

    <template v-if="isLoading">
      <skeleton-list-item v-for="n in 3" :key="n" />
    </template>
    <template v-else>
      <n-list-item v-for="board in boards" :key="board.id">
        <n-thing :title="board.name"> Created: {{ dayjs(board.date.toDate()).format('L') }} </n-thing>
        <template #suffix>
          <n-space justify="space-between" :wrap="false">
            <styled-link
              :to="{
                name: 'RetroBoard',
                params: { teamId, boardId: board.id },
              }"
              >Open</styled-link
            >
            <n-button @click="removeBoard(board.id)" text v-if="hasWriteAccess">Remove</n-button>
          </n-space>
        </template>
      </n-list-item>
    </template>
  </n-list>
  <n-empty v-else description="No boards found">
    <template #extra>
      <n-button size="small" @click="openModal"> Create new board </n-button>
    </template>
  </n-empty>
  <create-retro-board-modal v-model:is-visible="isModalVisible" :team-id="teamId" />
</template>

<style scoped lang="scss"></style>
