import type { TeamMemberRole } from '@/types/TeamMemberRole';

export type TeamMember = {
  email: string;
  role: TeamMemberRole;
  invitation?: string;
};
