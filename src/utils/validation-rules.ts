import type { FormItemRule } from 'naive-ui';

export const validEmailRule = [
  {
    required: true,
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error('Email is required');
      } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
        return new Error('Value needs to be an email address');
      }
      return true;
    },
    trigger: ['blur'],
  },
];

export const validPasswordRule = [
  {
    required: true,
    message: 'Password is required',
  },
];
