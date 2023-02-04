import type { TeamMemberRole } from '@/types/TeamMemberRole';

export type TeamMember = {
  id: string;
  email: string;
  role: TeamMemberRole;
};
