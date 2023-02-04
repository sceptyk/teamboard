<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { NSpace, NButton, NInput, NThing, NIcon, NForm, type FormRules } from 'naive-ui';
import { ThumbsUpSharp as ThumbsUpSharpIcon, Pencil as PencilIcon, Trash as TrashIcon } from '@vicons/ionicons5';
import type { RetroBoardCardType } from '@/types/RetroBoardCardType';
import type { RetroBoardCard } from '@/types/RetroBoardCard';
import type { Type as ButtonType } from 'naive-ui/es/button/src/interface';
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, updateDoc } from '@firebase/firestore';
import { useCurrentUser, useFirestore } from 'vuefire';
import type { FirebaseEntity } from '@/types/FirebaseEntity';

const props = defineProps<{
  teamId: string;
  boardId: string;
  type: RetroBoardCardType;
  revealed: boolean;
  data?: RetroBoardCard & FirebaseEntity;
}>();

const db = useFirestore();
const user = useCurrentUser();

const isSaving = ref(false);
const isVoting = ref(false);
const isEditing = ref(false);

const cardFormRef = ref<InstanceType<typeof NForm>>();
const cardModel = ref<{
  text: string;
}>({
  text: '',
});

watch(
  () => props.data?.text,
  (value) => {
    if (value) cardModel.value.text = value;
  },
  { immediate: true },
);

const rules: FormRules = {
  text: [
    {
      required: true,
      message: 'Cart text is required',
    },
  ],
};

const updateCardText = async (cardId: string) => {
  await updateDoc(doc(db, 'teams', props.teamId, 'retro-boards', props.boardId, 'cards', cardId), {
    text: cardModel.value.text,
  });
};

const addCard = async () => {
  const data: RetroBoardCard = {
    type: props.type,
    text: cardModel.value.text,
    author: user.value?.uid!,
    votes: [],
  };
  await addDoc(collection(db, 'teams', props.teamId, 'retro-boards', props.boardId, 'cards'), data);
};

const saveCard = () => {
  cardFormRef.value?.validate(async (errors) => {
    if (!errors) {
      isSaving.value = true;
      try {
        if (props.data?.id) {
          await updateCardText(props.data.id);
        } else {
          await addCard();
        }
      } finally {
        isSaving.value = false;
        isEditing.value = false;
        cardModel.value.text = props.data?.text ?? '';
      }
    }
  });
};

const naiveType = computed<ButtonType>(() => {
  if (props.type === 'went-well') return 'success';
  if (props.type === 'to-improve') return 'error';
  if (props.type === 'actionable') return 'info';
  return 'default';
});

const placeholder = computed(() => {
  if (props.type === 'went-well') return 'What went well?';
  if (props.type === 'to-improve') return 'What can we improve?';
  if (props.type === 'actionable') return 'What we should start doing?';
  return '';
});

const isAuthor = computed(() => props.data?.author === user.value?.uid);

const cardContent = computed(() => {
  if (props.revealed || isAuthor.value) {
    return props.data?.text;
  } else if (props.data?.text) {
    const length = props.data.text.length;
    return [...new Array(length)].reduce((prev) => {
      if (Math.random() > 0.85) return prev + ' ';
      return prev + String.fromCharCode(97 + Math.floor(Math.random() * 26));
    }, '');
  }
  return '';
});

const hasVoted = computed(() => {
  if (user.value) {
    return props.data?.votes.includes(user.value?.uid);
  }
  return false;
});

const vote = async () => {
  if (props.data?.id && user.value) {
    isVoting.value = true;
    try {
      await updateDoc(doc(db, 'teams', props.teamId, 'retro-boards', props.boardId, 'cards', props.data.id), {
        votes: hasVoted.value ? arrayRemove(user.value.uid) : arrayUnion(user.value.uid),
      });
    } finally {
      isVoting.value = false;
      cardModel.value.text = '';
    }
  }
};

const remove = async () => {
  if (props.data?.id && user.value) {
    await deleteDoc(doc(db, 'teams', props.teamId, 'retro-boards', props.boardId, 'cards', props.data.id));
  }
};
</script>

<template>
  <n-space vertical v-if="isEditing || !data">
    <n-form ref="cardFormRef" :model="cardModel" :rules="rules" @submit.prevent="saveCard">
      <n-space vertical>
        <n-input
          :placeholder="placeholder"
          type="textarea"
          :autosize="{
            minRows: 2,
            maxRows: 4,
          }"
          v-model:value="cardModel.text"
        />
        <n-space justify="end">
          <n-button round size="small" tertiary :type="naiveType" attr-type="submit">Save</n-button>
        </n-space>
      </n-space>
    </n-form>
  </n-space>
  <n-thing v-else>
    <template #description>
      <span :class="{ blur: !isAuthor && !revealed }">{{ cardContent }}</span>
    </template>
    <template #footer>
      <n-space :justify="isAuthor ? 'space-between' : 'end'">
        <n-space v-if="isAuthor">
          <n-button round quaternary type="default" size="small" @click="isEditing = !isEditing">
            <template #icon>
              <n-icon size="small">
                <pencil-icon />
              </n-icon>
            </template>
          </n-button>
          <n-button round quaternary type="error" size="small" @click="remove">
            <template #icon>
              <n-icon size="small">
                <trash-icon />
              </n-icon>
            </template>
          </n-button>
        </n-space>
        <n-button
          :disabled="isAuthor || !revealed"
          round
          quaternary
          :type="hasVoted ? naiveType : 'default'"
          size="small"
          @click="vote"
        >
          {{ data.votes.length }}
          <template #icon>
            <n-icon size="small">
              <thumbs-up-sharp-icon />
            </n-icon>
          </template>
        </n-button>
      </n-space>
    </template>
  </n-thing>
</template>

<style scoped lang="scss">
.blur {
  filter: blur(3px);
}
</style>
