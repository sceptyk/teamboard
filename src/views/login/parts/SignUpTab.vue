<script setup lang="ts">
import { NForm, NFormItemRow, NInput, NButton, type FormRules, type FormItemRule } from 'naive-ui';
import { ref } from 'vue';
import { useFirebaseAuth } from 'vuefire';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { validEmailRule, validPasswordRule } from '@/utils/validation-rules';

const emit = defineEmits(['complete']);

const auth = useFirebaseAuth()!;

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
  reenteredPassword: [
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
      await createUserWithEmailAndPassword(auth, signUpModel.value.email, signUpModel.value.password);
      emit('complete');
    }
  });
};
</script>

<template>
  <n-form ref="signUpFormRef" :model="signUpModel" :rules="rules" @submit.prevent="signUp">
    <n-form-item-row path="email" label="Email">
      <n-input v-model:value="signUpModel.email" />
    </n-form-item-row>
    <n-form-item-row path="password" label="Password">
      <n-input type="password" v-model:value="signUpModel.password" />
    </n-form-item-row>
    <n-form-item-row path="confirmPassword" label="Reenter Password">
      <n-input type="password" v-model:value="signUpModel.confirmPassword" />
    </n-form-item-row>
    <n-button type="primary" block attr-type="submit"> Sign up </n-button>
  </n-form>
</template>

<style scoped lang="scss"></style>
