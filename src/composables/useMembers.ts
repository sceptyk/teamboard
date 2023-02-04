import type { TeamMember } from '@/types/TeamMember';
import { collection } from 'firebase/firestore';
import { computed, ref, watch, type Ref } from 'vue';
import { useCollection, useFirestore } from 'vuefire';

export function useMembers(teamId: Ref<string>) {
  const db = useFirestore();

  const membersSource = computed(() => {
    if (teamId.value) {
      return collection(db, 'teams', teamId.value, 'members');
    }
    return undefined;
  });
  const { data } = useCollection<TeamMember>(membersSource);

  const isLoading = ref(true);
  watch(data, () => (isLoading.value = false));

  return { data, isLoading };
}
