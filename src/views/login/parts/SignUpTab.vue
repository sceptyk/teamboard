<script setup lang="ts">
import { NForm, NFormItemRow, NInput, NButton, NSpace, NAlert, type FormRules, type FormItemRule } from 'naive-ui';
import { ref } from 'vue';
import { useFirebaseAuth } from 'vuefire';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { validEmailRule, validPasswordRule } from '@/utils/validation-rules';

const emit = defineEmits(['complete']);

const auth = useFirebaseAuth()!;
const error = ref();
const isLoading = ref(false);

const signUpFormRef = ref<InstanceType<typeof NForm>>();

const signUpModel = ref<{
  email: string;
  password: string;
  confirmPassword: string;
}>({
  email: '',
  password: '',
  confirmPassword: '',
});

const validatePasswordStartWith = (_rule: FormItemRule, value: string): boolean => {
  return (
    !!signUpModel.value.password &&
    signUpModel.value.password.startsWith(value) &&
    signUpModel.value.password.length >= value.length
  );
};

const validatePasswordSame = (_rule: FormItemRule, value: string): boolean => {
  return value === signUpModel.value.password;
};

const rules: FormRules = {
  email: validEmailRule,
  password: validPasswordRule,
  confirmPassword: [
    {
      required: true,
      message: 'Re-entered password is required',
      trigger: ['input', 'blur'],
    },
    {
      validator: validatePasswordStartWith,
      message: 'Password is not same as re-entered password!',
      trigger: 'input',
    },
    {
      validator: validatePasswordSame,
      message: 'Password is not same as re-entered password!',
      trigger: ['blur', 'password-input'],
    },
  ],
};

const signUp = () => {
  signUpFormRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        isLoading.value = true;
        await createUserWithEmailAndPassword(auth, signUpModel.value.email, signUpModel.value.password);
        emit('complete');
      } catch (e) {
        console.error(e);
        error.value = e;
      } finally {
        isLoading.value = false;
      }
    }
  });
};
</script>

<template>
  <n-space vertical>
    <n-alert v-if="error" title="Error occurred" type="error">
      {{ error.message }}
    </n-alert>
    <n-form ref="signUpFormRef" :model="signUpModel" :rules="rules" @submit.prevent="signUp">
      <n-form-item-row path="email" label="Email">
        <n-input v-model:value="signUpModel.email" placeholder="Enter email" />
      </n-form-item-row>
      <n-form-item-row path="password" label="Password">
        <n-input type="password" v-model:value="signUpModel.password" placeholder="Enter password" />
      </n-form-item-row>
      <n-form-item-row path="confirmPassword" label="Confirm Password">
        <n-input type="password" v-model:value="signUpModel.confirmPassword" placeholder="Confirm password" />
      </n-form-item-row>
      <n-button type="primary" block attr-type="submit" :loading="isLoading"> Sign up </n-button>
    </n-form>
  </n-space>
</template>

<style scoped lang="scss"></style>
