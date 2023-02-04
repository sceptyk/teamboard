<script setup lang="ts">
import type { UserData } from '@/types/UserData';
import { signOut } from '@firebase/auth';
import { collection, doc } from '@firebase/firestore';
import { NPageHeader, NSpace, NDropdown, NIcon, NButton } from 'naive-ui';
import { LogoGithub as LogoGithubIcon } from '@vicons/ionicons5';
import { useRouter } from 'vue-router';
import { useCurrentUser, useDocument, useFirebaseAuth, useFirestore } from 'vuefire';
import TeamboardLogo from '@/components/TeamboardLogo.vue';

const router = useRouter();
const db = useFirestore();
const auth = useFirebaseAuth();

const user = useCurrentUser();
const userData = useDocument<UserData>(doc(collection(db, 'users'), user.value?.uid));

const userMenuItems = [
  {
    label: 'Settings',
    key: 'settings',
  },
  {
    label: 'Sign out',
    key: 'signout',
  },
];

const onMenuItemSelect = async (key: string) => {
  if (key === 'signout') {
    await signOut(auth!);
    router.push('/login');
  } else if (key === 'settings') {
    router.push('/settings');
  }
};
</script>

<template>
  <n-page-header>
    <template #title>
      <router-link to="/teams">
        <teamboard-logo />
      </router-link>
    </template>
    <template #subtitle>
      <slot name="breadcrumbs" />
    </template>
    <template #extra>
      <n-space>
        <n-button tag="a" href="https://github.com/sceptyk/teamboard" target="_blank" quaternary type="default" round>
          <template #icon>
            <n-icon>
              <logo-github-icon />
            </n-icon>
          </template>
        </n-button>
        <n-dropdown trigger="click" :options="userMenuItems" placement="bottom-end" @select="onMenuItemSelect">
          <n-button round bordered>
            {{ userData?.name ?? '' }}
          </n-button>
        </n-dropdown>
      </n-space>
    </template>
  </n-page-header>
</template>

<style scoped lang="scss"></style>
