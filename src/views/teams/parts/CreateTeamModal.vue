<script setup lang="ts">
import { NButton, NSpace, NModal, NForm, NFormItemRow, NInput, type FormRules } from 'naive-ui';
import { useCurrentUser, useFirestore } from 'vuefire';
import { collection, addDoc, doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref } from 'vue';
import type { Team } from '@/types/Team';
import type { TeamMember } from '@/types/TeamMember';

defineProps<{
  isVisible: boolean;
}>();

const emit = defineEmits(['update:is-visible']);

const db = useFirestore();
const user = useCurrentUser();

const isLoading = ref(false);

const teamFormRef = ref<InstanceType<typeof NForm>>();
const teamModel = ref<{
  name: string;
}>({
  name: '',
});

const rules: FormRules = {
  name: [
    {
      required: true,
      message: 'Team name is required',
    },
  ],
};

const createTeam = async () => {
  teamFormRef.value?.validate(async (errors) => {
    if (!errors) {
      isLoading.value = true;
      try {
        const userId = user.value?.uid!;
        const teamData: Team = {
          name: teamModel.value.name,
          owner: userId,
          members: [userId],
        };
        const team = await addDoc(collection(db, 'teams'), teamData);
        const teamMemberData: TeamMember = {
          id: userId,
          email: user.value?.email!,
          role: 'owner',
        };
        await setDoc(doc(db, 'teams', team.id, 'members', userId), teamMemberData);
      } finally {
        isLoading.value = false;
        teamModel.value.name = '';
        emit('update:is-visible', false);
      }
    }
  });
};
</script>

<template>
  <n-modal
    :show="isVisible"
    @update:show="$emit('update:is-visible', $event)"
    preset="card"
    title="New team"
    :bordered="false"
    size="huge"
    style="max-width: 480px"
  >
    <n-form ref="teamFormRef" :model="teamModel" :rules="rules">
      <n-form-item-row path="name" label="Team name">
        <n-input v-model:value="teamModel.name" />
      </n-form-item-row>
    </n-form>
    <template #footer>
      <n-space justify="end">
        <n-button @click="$emit('update:is-visible', false)">Cancel</n-button>
        <n-button @click="createTeam" type="primary" :loading="isLoading">Create</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<style scoped lang="scss"></style>
