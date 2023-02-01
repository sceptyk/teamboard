<script setup lang="ts">
import PageLayout from '@/components/layout/PageLayout.vue';
import PageHeader from '@/components/layout/PageHeader.vue';
import { NResult, NSpin, NSpace } from 'naive-ui';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCurrentUser, useDocument, useFirestore } from 'vuefire';
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from '@firebase/firestore';
import StyledLink from '@/components/ui/StyledLink.vue';
import type { TeamMember } from '@/types/TeamMember';

const route = useRoute();

const teamBoardRoute = computed(() => {
  const { teamId } = route.params;
  return {
    name: 'TeamBoard',
    params: { teamId },
  };
});

const teamsRoute = computed(() => ({
  name: 'Teams',
}));

const isLoading = ref(true);
const errorReason = ref('');
const successReason = ref('');

const db = useFirestore();
const user = useCurrentUser();
const source = computed(() => {
  const { teamId, invitationId } = route.params;
  if (teamId && invitationId) {
    return doc(db, 'teams', teamId as string, 'invitations', invitationId as string);
  }
  return undefined;
});
const { data: invitation, error } = useDocument(source);

watch(error, () => {
  if (error) {
    errorReason.value = 'Invitation does not exist anymore';
  }
});

watch(invitation, async () => {
  const { teamId } = route.params;
  if (invitation) {
    try {
      const userId = user.value?.uid!;
      const isMember = await getDoc(doc(db, 'teams', teamId as string, 'members', userId));

      if (isMember.exists()) {
        successReason.value = 'You are already a member of the team';
      } else {
        await updateDoc(doc(db, 'teams', teamId as string), {
          members: arrayUnion([user.value?.uid]),
        });
        const teamMemberData: TeamMember = {
          id: userId,
          email: user.value?.email!,
          role: 'viewer',
        };
        await setDoc(doc(db, 'teams', teamId as string, 'members', userId), teamMemberData);
        successReason.value = "You're all set";
      }
    } catch (e) {
      errorReason.value = 'There was an error adding you as a member';
    } finally {
      isLoading.value = false;
    }
  }
});
</script>

<template>
  <page-layout>
    <template #content>
      <n-result
        v-if="isLoading"
        status="info"
        title="Processing invitation"
        description="We're setting you up in the team."
      >
        <template #footer>
          <n-space justify="center">
            <n-spin style="overflow: hidden" />
          </n-space>
        </template>
      </n-result>
      <n-result v-else-if="errorReason" status="error" title="Error has occurred" :description="errorReason">
        <template #footer>
          <n-space justify="center">
            <styled-link :to="teamsRoute" button>Take me to my teams</styled-link>
          </n-space>
        </template>
      </n-result>
      <n-result v-else status="success" title="Success" :description="successReason">
        <template #footer>
          <n-space justify="center">
            <styled-link :to="teamBoardRoute" button>Take me to the team board</styled-link>
          </n-space>
        </template>
      </n-result>
    </template>
  </page-layout>
</template>

<style scoped lang="scss"></style>
