<script setup lang="ts">
import { NTabs, NTabPane } from 'naive-ui';
import PageHeader from '@/components/layout/PageHeader.vue';
import PageLayout from '@/components/layout/PageLayout.vue';
import PlanningBoardsTab from '@/views/team-board/parts/PlanningBoardsTab.vue';
import RetroBoardsTab from '@/views/team-board/parts/RetroBoardsTab.vue';
import MembersTab from '@/views/team-board/parts/MembersTab.vue';
</script>

<template>
  <page-layout>
    <template #content>
      <n-tabs type="line" animated>
        <n-tab-pane name="planning" tab="Planning">
          <planning-boards-tab />
        </n-tab-pane>
        <n-tab-pane name="retro" tab="Retro">
          <retro-boards-tab />
        </n-tab-pane>
        <n-tab-pane name="members" tab="Members">
          <members-tab />
        </n-tab-pane>
      </n-tabs>
    </template>
  </page-layout>
</template>

<style scoped lang="scss"></style>
