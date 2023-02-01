<script setup lang="ts">
import { doc, getDoc, setDoc } from '@firebase/firestore';
import { onMounted } from 'vue';
import { useCurrentUser, useFirestore } from 'vuefire';
import type { UserData } from '@/types/UserData';

const db = useFirestore();
const user = useCurrentUser();

onMounted(async () => {
  if (user.value) {
    const source = doc(db, 'users', user.value.uid);
    const userDoc = await getDoc(source);

    if (!userDoc.exists()) {
      const email = user.value.email!;
      const data: UserData = {
        email,
        name: email.split('@')[0],
      };
      await setDoc(source, data);
    }
  }
});
</script>

<template>
  <router-view />
</template>

<style scoped lang="scss"></style>
