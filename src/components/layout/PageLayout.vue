<script setup lang="ts">
import { NLayout, NLayoutHeader, NBreadcrumb, NBreadcrumbItem } from 'naive-ui';
import PageHeader from '@/components/layout/PageHeader.vue';
import PageContent from '@/components/layout/PageContent.vue';
import type { RouteLocationRaw } from 'vue-router';
import StyledLink from '@/components/styled/StyledLink.vue';

defineProps<{
  breadcrumbs?: {
    route?: RouteLocationRaw;
    title: string;
  }[];
}>();
</script>

<template>
  <n-layout class="layout">
    <n-layout-header class="header">
      <slot name="header">
        <page-header>
          <template #breadcrumbs>
            <n-breadcrumb>
              <n-breadcrumb-item v-for="breadcrumb in breadcrumbs" :key="breadcrumb.title">
                <styled-link v-if="breadcrumb.route" :to="breadcrumb.route">{{ breadcrumb.title }}</styled-link>
                <div v-else>{{ breadcrumb.title }}</div>
              </n-breadcrumb-item>
            </n-breadcrumb>
          </template>
        </page-header>
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
