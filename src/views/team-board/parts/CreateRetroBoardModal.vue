<script setup lang="ts">
import { NButton, NSpace, NModal, NForm, NFormItemRow, NInput, type FormRules } from 'naive-ui';
import { useFirestore } from 'vuefire';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref } from 'vue';
import type { RetroBoard } from '@/types/RetroBoard';
import dayjs from 'dayjs';

const props = defineProps<{
  isVisible: boolean;
  teamId: string;
}>();

const emit = defineEmits(['update:is-visible']);

const db = useFirestore();

const isLoading = ref(false);

const boardFormRef = ref<InstanceType<typeof NForm>>();
const boardModel = ref<{
  name: string;
}>({
  name: `Retrospective ${dayjs().format('DD-MM')}`,
});

const rules: FormRules = {
  name: [
    {
      required: true,
      message: 'Board name is required',
    },
  ],
};

const createBoard = async () => {
  boardFormRef.value?.validate(async (errors) => {
    if (!errors) {
      isLoading.value = true;
      try {
        const data: RetroBoard = {
          name: boardModel.value.name,
          date: Timestamp.fromDate(new Date()),
        };
        await addDoc(collection(db, 'teams', props.teamId, 'retro-boards'), data);
      } finally {
        isLoading.value = false;
        boardModel.value.name = '';
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
    title="New board"
    :bordered="false"
    size="huge"
    style="max-width: 480px"
  >
    <n-form ref="boardFormRef" :model="boardModel" :rules="rules">
      <n-form-item-row path="name" label="Board name">
        <n-input v-model:value="boardModel.name" />
      </n-form-item-row>
    </n-form>
    <template #footer>
      <n-space justify="end">
        <n-button @click="$emit('update:is-visible', false)">Cancel</n-button>
        <n-button @click="createBoard" type="primary" :loading="isLoading">Create</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<style scoped lang="scss"></style>
