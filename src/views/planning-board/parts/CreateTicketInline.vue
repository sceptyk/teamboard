<script setup lang="ts">
import { NSpace, NInput, NButton, NIcon, NForm, type FormRules } from 'naive-ui';
import { Add as AddIcon } from '@vicons/ionicons5';
import { useFirestore } from 'vuefire';
import { collection, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { ref } from 'vue';
import type { PlanningBoardTicket } from '@/types/PlanningBoardTicket';

const props = defineProps<{
  teamId: string;
  boardId: string;
}>();

const db = useFirestore();

const isLoading = ref(false);
const inputRef = ref();

defineExpose({ inputRef });

const ticketFormRef = ref<InstanceType<typeof NForm>>();
const ticketModel = ref<{
  title: string;
}>({
  title: '',
});

const rules: FormRules = {
  title: [
    {
      required: true,
      message: 'Ticket title is required',
    },
  ],
};

const createTicket = async () => {
  ticketFormRef.value?.validate(async (errors) => {
    if (!errors) {
      isLoading.value = true;
      try {
        const data: PlanningBoardTicket = {
          title: ticketModel.value.title,
          date: Timestamp.fromDate(new Date()),
        };
        const ticket = await addDoc(
          collection(db, 'teams', props.teamId, 'planning-boards', props.boardId, 'tickets'),
          data,
        );
        await updateDoc(doc(db, 'teams', props.teamId, 'planning-boards', props.boardId), {
          activeTicket: ticket.id,
        });
      } finally {
        isLoading.value = false;
        ticketModel.value.title = '';
      }
    }
  });
};
</script>

<template>
  <n-form ref="ticketFormRef" :model="ticketModel" :rules="rules" @submit.prevent="createTicket">
    <n-space justify="space-between">
      <n-input ref="inputRef" v-model:value="ticketModel.title" placeholder="Ticket title..." />
      <n-button tertiary circle type="primary" attr-type="submit" :loading="isLoading">
        <template #icon>
          <n-icon><add-icon /></n-icon>
        </template>
      </n-button>
    </n-space>
  </n-form>
</template>

<style scoped lang="scss"></style>
