<script setup lang="ts">
import { NList, NListItem, NThing, NTooltip, NButton, NSpace, NIcon, NSwitch } from 'naive-ui';
import { useCurrentUser, useFirestore } from 'vuefire';
import type { TeamMember } from '@/types/TeamMember';
import { useRoute } from 'vue-router';
import { computed, ref, toRef } from 'vue';
import { addDoc, collection, deleteDoc, doc, Timestamp, updateDoc } from '@firebase/firestore';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/LocalizedFormat';
import type { TeamInvitation } from '@/types/TeamInvitation';
import { Link as LinkIcon } from '@vicons/ionicons5';
import type { FirebaseEntity } from '@/types/FirebaseEntity';
import SkeletonListItem from '@/components/SkeletonListItem.vue';
import { useTeamAccess } from '@/composables/useTeamAccess';

dayjs.extend(LocalizedFormat);

const props = defineProps<{
  members: (TeamMember & FirebaseEntity)[];
  isLoading: boolean;
}>();

const route = useRoute();
const db = useFirestore();
const user = useCurrentUser();
const { hasWriteAccess } = useTeamAccess(toRef(props, 'members'));

const showLinkCopied = ref(false);

const teamId = computed(() => route.params.teamId as string);

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

const updateRole = async (memberId: string, enableEditing: boolean) => {
  await updateDoc(doc(db, 'teams', teamId.value, 'members', memberId), {
    role: enableEditing ? 'moderator' : 'viewer',
  });
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
    <template v-if="isLoading">
      <skeleton-list-item v-for="n in 3" :key="n" />
    </template>
    <template v-else>
      <n-list-item v-for="member in members" :key="member.id">
        <n-space justify="space-between" align="center">
          <n-thing>
            <template #header>{{ member.email }}</template>
            <template #description>{{ member.role }}</template>
          </n-thing>
          <n-space v-if="member.role !== 'owner' && member.id !== user?.uid && hasWriteAccess" align="center">
            <n-switch @update:value="updateRole(member.id, $event)">
              <template #checked> Disable editing </template>
              <template #unchecked> Enable editing </template>
            </n-switch>
            <n-button @click="removeMember(member.id)" text>Remove</n-button>
          </n-space>
        </n-space>
      </n-list-item>
    </template>
  </n-list>
</template>

<style scoped lang="scss"></style>
