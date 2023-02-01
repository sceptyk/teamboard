<script setup lang="ts">
import { NLayout, NLayoutHeader } from 'naive-ui';
import PageHeader from '@/components/layout/PageHeader.vue';
import PageContent from '@/components/layout/PageContent.vue';
</script>

<template>
  <n-layout class="layout">
    <n-layout-header class="header">
      <slot name="header">
        <page-header />
      </slot>
    </n-layout-header>
    <slot name="main">
      <page-content>
        <template #content>
          <slot name="content" />
        </template>
      </page-content>
    </slot>
  </n-layout>
</template>

<style scoped lang="scss">
.layout {
  min-height: 100vh;
}

.header {
  padding: 12px 16px;
}
</style>
