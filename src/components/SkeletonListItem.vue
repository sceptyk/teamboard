<script setup lang="ts">
import { NListItem, NSpace, NSkeleton } from 'naive-ui';
</script>

<template>
  <n-list-item>
    <n-space justify="space-between" align="center">
      <n-space vertical>
        <n-skeleton text size="medium" width="180px" />
        <n-skeleton text width="100px" />
      </n-space>
      <n-skeleton width="120px" />
    </n-space>
  </n-list-item>
</template>

<style scoped lang="scss"></style>
