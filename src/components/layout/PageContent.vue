<script setup lang="ts">
import { NLayout, NLayoutContent, NLayoutSider } from 'naive-ui';

defineProps<{
  fullScreen?: boolean;
}>();
</script>

<template>
  <n-layout :has-sider="!!$slots.sider" :class="{ centered: !fullScreen }">
    <n-layout-sider v-if="!!$slots.sider" class="sider">
      <slot name="sider" />
    </n-layout-sider>
    <n-layout-content class="content">
      <slot name="content" />
    </n-layout-content>
  </n-layout>
</template>

<style scoped lang="scss">
.centered {
  max-width: 1080px;
  margin: auto;
}

.sider {
  padding: 12px 16px;
  box-sizing: content-box;
  height: 100vh;
}

.content {
  padding: 12px 16px;
}
</style>
