<script setup lang="ts">
import { NList, NListItem, NThing, NTooltip, NButton, NSpace, NIcon } from 'naive-ui';
import { useCollection, useCurrentUser, useFirestore } from 'vuefire';
import type { TeamMember } from '@/types/TeamMember';
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';
import { addDoc, collection, deleteDoc, doc, Timestamp } from '@firebase/firestore';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/LocalizedFormat';
import type { TeamInvitation } from '@/types/TeamInvitation';
import { Link as LinkIcon } from '@vicons/ionicons5';

dayjs.extend(LocalizedFormat);

const route = useRoute();
const db = useFirestore();
const user = useCurrentUser();

const showLinkCopied = ref(false);

const teamId = computed(() => route.params.teamId as string);

const source = computed(() => {
  return collection(db, 'teams', teamId.value, 'members');
});
const { data: members } = useCollection<TeamMember>(source);

const copyInvitationLink = async () => {
  const data: TeamInvitation = {
    date: Timestamp.fromDate(new Date()),
  };
  const invitation = await addDoc(collection(db, 'teams', teamId.value, 'invitations'), data);
  await navigator.clipboard.writeText(
    `${window.location.protocol}//${window.location.host}/teams/${teamId.value}/invitation/${invitation.id}`,
  );
  showLinkCopied.value = true;
  setTimeout(() => (showLinkCopied.value = false), 2000);
};

const removeMember = async (memberId: string) => {
  await deleteDoc(doc(db, 'teams', teamId.value, 'members', memberId));
};
</script>

<template>
  <n-list hoverable>
    <template #header>
      <n-space justify="end" align="center">
        <n-space>
          <n-tooltip :show="showLinkCopied" placement="top-end">
            Link copied successfully 🎉
            <template #trigger>
              <n-button @click="copyInvitationLink" type="primary" icon-placement="right"
                >Copy invitation link
                <template #icon>
                  <n-icon>
                    <link-icon />
                  </n-icon>
                </template>
              </n-button>
            </template>
          </n-tooltip>
        </n-space>
      </n-space>
    </template>
    <n-list-item v-for="member in members" :key="member.id">
      <n-thing :title="member.email"></n-thing>
      <template #suffix>
        <n-button v-if="member.id !== user?.uid" @click="removeMember(member.id)" text>Remove</n-button>
      </template>
    </n-list-item>
  </n-list>
</template>

<style scoped lang="scss"></style>
