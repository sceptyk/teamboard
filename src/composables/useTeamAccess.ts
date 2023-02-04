import type { TeamMember } from '@/types/TeamMember';
import { computed, type Ref } from 'vue';
import { useCurrentUser } from 'vuefire';

export function useTeamAccess(members: Ref<TeamMember[]>) {
  const user = useCurrentUser();

  const hasWriteAccess = computed(() => {
    if (user.value) {
      const currentUserMembership = members.value?.find((m) => m.id === user.value?.uid);
      if (currentUserMembership) {
        return ['owner', 'moderator'].includes(currentUserMembership.role);
      }
    }
    return false;
  });

  return { hasWriteAccess };
}
