<script setup lang="ts">
import { NA, NButton, type ButtonProps } from 'naive-ui';
import type { RouteLocationRaw, RouterLinkProps } from 'vue-router';

defineProps<{
  button?: boolean;
  to: RouteLocationRaw;
  buttonProps?: ButtonProps;
  linkProps?: RouterLinkProps;
}>();
</script>

<template>
  <router-link v-bind="linkProps" :to="to" #default="{ navigate, href }" custom>
    <n-button v-if="button" v-bind="buttonProps" tag="a" :href="href" @click="navigate"><slot /></n-button>
    <n-a v-else :href="href" @click="navigate" class="link"> <slot /> </n-a>
  </router-link>
</template>

<style scoped lang="scss">
.link {
  display: flex;
  width: max-content;
  text-decoration: none;
}
</style>
