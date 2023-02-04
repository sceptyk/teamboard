<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import PageLayout from '@/components/layout/PageLayout.vue';
import { NSpace, NButton, NInput, NForm, NFormItemRow, NThing, NH1, NText, type FormRules } from 'naive-ui';
import { useCurrentUser, useDocument, useFirestore } from 'vuefire';
import { collection, doc, updateDoc } from '@firebase/firestore';

const db = useFirestore();
const user = useCurrentUser();

const isLoading = ref(false);

const settingsFormRef = ref<InstanceType<typeof NForm>>();
const settingsModel = ref<{
  name: string;
}>({
  name: ``,
});

const rules: FormRules = {
  name: [
    {
      required: true,
      message: 'User name is required',
    },
  ],
};

const userDataSource = computed(() => {
  return doc(collection(db, 'users'), user.value?.uid);
});

const { data: userData } = useDocument(userDataSource);

watch(
  () => userData.value?.name,
  (value) => {
    settingsModel.value.name = value;
  },
);

const updateName = () => {
  settingsFormRef.value?.validate(async (errors) => {
    if (!errors && user.value) {
      isLoading.value = true;
      try {
        await updateDoc(userDataSource.value, {
          name: settingsModel.value.name,
        });
      } finally {
        isLoading.value = false;
      }
    }
  });
};

const resetName = () => {
  settingsModel.value.name = userData.value?.name;
};
</script>

<template>
  <page-layout>
    <template #content>
      <div class="content">
        <n-h1 style="margin-bottom: 0">
          <n-text type="primary"> Settings </n-text>
        </n-h1>
        <n-thing>
          <template #title>User name</template>
          <n-form ref="settingsFormRef" :model="settingsModel" :rules="rules">
            <n-form-item-row path="name" label="User name">
              <n-input v-model:value="settingsModel.name" />
            </n-form-item-row>
          </n-form>
          <template #footer>
            <n-space justify="end">
              <n-button @click="resetName">Cancel</n-button>
              <n-button @click="updateName" type="primary" :loading="isLoading">Save</n-button>
            </n-space>
          </template>
        </n-thing>
      </div>
    </template>
  </page-layout>
</template>

<style scoped lang="scss">
.content {
  max-width: 456px;
  margin: auto;
}
</style>
