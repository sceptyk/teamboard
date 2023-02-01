<script setup lang="ts">
import { NForm, NFormItemRow, NInput, NIcon, NButton, NDivider, type FormRules } from 'naive-ui';
import { ref } from 'vue';
import { useFirebaseAuth } from 'vuefire';
import { LogoGoogle } from '@vicons/ionicons5';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { validEmailRule, validPasswordRule } from '@/utils/validation-rules';

const emit = defineEmits(['complete']);
const auth = useFirebaseAuth()!;

const signInFormRef = ref<InstanceType<typeof NForm>>();

const signInModel = ref<{
  email: string;
  password: string;
}>({
  email: '',
  password: '',
});

const rules: FormRules = {
  email: validEmailRule,
  password: validPasswordRule,
};

const signInWithPassword = () => {
  signInFormRef.value?.validate(async (errors) => {
    if (!errors) {
      await signInWithEmailAndPassword(auth, signInModel.value.email, signInModel.value.password);
      emit('complete');
    }
  });
};

const signInWithGoogle = async () => {
  await signInWithPopup(auth, new GoogleAuthProvider());
  emit('complete');
};
</script>

<template>
  <n-form ref="signInFormRef" :model="signInModel" :rules="rules" @submit.prevent="signInWithPassword">
    <n-form-item-row path="email" label="Email">
      <n-input v-model:value="signInModel.email" />
    </n-form-item-row>
    <n-form-item-row path="password" label="Password">
      <n-input type="password" v-model:value="signInModel.password" />
    </n-form-item-row>
    <n-button type="primary" block attr-type="submit"> Sign in </n-button>
  </n-form>
  <n-divider />
  <n-button block secondary icon-placement="right" @click="signInWithGoogle">
    Sign in with Google
    <template #icon>
      <n-icon>
        <logo-google />
      </n-icon>
    </template>
  </n-button>
</template>

<style scoped lang="scss"></style>
