<script setup lang="ts">
import type { FirebaseEntity } from '@/types/FirebaseEntity';
import type { RetroBoardCard } from '@/types/RetroBoardCard';
import BoardCard from '@/views/retro-board/parts/BoardCard.vue';
import { NGridItem, NList, NH3, NListItem, NText, NSkeleton, NSpace } from 'naive-ui';
import { computed } from 'vue';
import type { Type as ButtonType } from 'naive-ui/es/button/src/interface';
import type { RetroBoardCardType } from '@/types/RetroBoardCardType';

const props = defineProps<{
  teamId: string;
  boardId: string;
  title: string;
  cards: (RetroBoardCard & FirebaseEntity)[];
  isLoading: boolean;
  revealed: boolean;
  type: RetroBoardCardType;
}>();

const naiveType = computed<ButtonType>(() => {
  if (props.type === 'went-well') return 'success';
  if (props.type === 'to-improve') return 'error';
  if (props.type === 'actionable') return 'info';
  return 'default';
});
</script>

<template>
  <n-list hoverable>
    <template #header>
      <n-h3 prefix="bar">
        <n-text :type="naiveType">{{ title }}</n-text>
      </n-h3>
    </template>
    <template v-if="isLoading">
      <n-list-item v-for="n in 3" :key="n">
        <n-space vertical>
          <n-skeleton text />
          <n-skeleton text width="60%" />
        </n-space>
      </n-list-item>
    </template>
    <template v-else>
      <n-list-item>
        <board-card :type="type" :team-id="teamId" :board-id="boardId" :revealed="revealed" />
      </n-list-item>
      <n-list-item v-for="card in cards" :key="card.id">
        <board-card :data="card" :type="card.type" :team-id="teamId" :board-id="boardId" :revealed="revealed" />
      </n-list-item>
    </template>
  </n-list>
</template>

<style scoped lang="scss"></style>
