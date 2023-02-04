<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui';
import { Link as LinkIcon } from '@vicons/ionicons5';

const copyLinkToClipboard = async () => {
  try {
    navigator.clipboard.writeText(window.location.href);
  } catch (e) {
    console.warn(e);
  }
};
</script>

<template>
  <n-button @click="copyLinkToClipboard" quaternary>
    <template #icon>
      <n-icon>
        <link-icon />
      </n-icon>
    </template>
    Copy link
  </n-button>
</template>

<style scoped lang="scss"></style>
