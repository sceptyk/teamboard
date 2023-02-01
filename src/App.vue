<script setup lang="ts">
import { RouterView } from 'vue-router';
import { darkTheme, NConfigProvider } from 'naive-ui';

const overrides = {
  common: { fontWeightStrong: '600' },
  Typography: {
    headerMargin1: '0',
    headerMargin2: '0',
    headerMargin3: '0',
    headerMargin4: '0',
    headerMargin5: '0',
    headerMargin6: '0',
  },
};
</script>

<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="overrides">
    <RouterView />
  </n-config-provider>
</template>
