<script setup lang="ts">
import { NSpace, NCard, NTabs, NTabPane } from 'naive-ui';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCurrentUser } from 'vuefire';
import SignInTab from '@/views/login/parts/SignInTab.vue';
import SignUpTab from '@/views/login/parts/SignUpTab.vue';

const route = useRoute();
const router = useRouter();

const navigateToAuthRoutes = () => {
  const to = route.query.redirectTo && typeof route.query.redirectTo === 'string' ? route.query.redirectTo : '/';
  router.push(to);
};

onMounted(async () => {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    navigateToAuthRoutes();
  }
});
</script>

<template>
  <n-space justify="center" class="wrapper">
    <n-card title="Teamboard Login" size="large" class="card">
      <n-tabs size="large" animated>
        <n-tab-pane name="signin" tab="Sign in">
          <sign-in-tab @complete="navigateToAuthRoutes" />
        </n-tab-pane>
        <n-tab-pane name="signup" tab="Sign up">
          <sign-up-tab @complete="navigateToAuthRoutes" />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </n-space>
</template>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
}

.card {
  min-width: 396px;
}
</style>
