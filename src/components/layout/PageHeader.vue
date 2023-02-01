<script setup lang="ts">
import type { UserData } from '@/types/UserData';
import { signOut } from '@firebase/auth';
import { collection, doc } from '@firebase/firestore';
import { NPageHeader, NGradientText, NTag, NSpace, NDropdown } from 'naive-ui';
import { useRouter } from 'vue-router';
import { useCurrentUser, useDocument, useFirebaseAuth, useFirestore } from 'vuefire';

const router = useRouter();
const db = useFirestore();
const auth = useFirebaseAuth();

const user = useCurrentUser();
const userData = useDocument<UserData>(doc(collection(db, 'users'), user.value?.uid));

const userMenuItems = [
  {
    label: 'Sign out',
    key: 'signout',
  },
];

const onMenuItemSelect = async (key: string) => {
  if (key === 'signout') {
    await signOut(auth!);
    router.push('/login');
  }
};
</script>

<template>
  <n-page-header>
    <template #title>
      <router-link to="/teams">
        <n-gradient-text
          gradient="radial-gradient( circle farthest-corner at 10% 20%,  rgba(14,174,87,1) 0%, rgba(12,116,117,1) 90% )"
        >
          Teamboard App
        </n-gradient-text>
      </router-link>
    </template>
    <template #extra>
      <n-space>
        <n-dropdown trigger="click" :options="userMenuItems" placement="bottom-end" @select="onMenuItemSelect">
          <n-tag round bordered size="large">
            {{ userData?.name ?? '' }}
          </n-tag>
        </n-dropdown>
      </n-space>
    </template>
  </n-page-header>
</template>

<style scoped lang="scss"></style>
