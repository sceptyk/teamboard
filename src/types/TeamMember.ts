export type TeamMember = {
  id: string;
  email: string;
  role: 'owner' | 'moderator' | 'viewer';
};
