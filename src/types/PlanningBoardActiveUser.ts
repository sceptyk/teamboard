import type { Timestamp } from 'firebase/firestore';

export type PlanningBoardActiveUser = {
  id: string;
  name: string;
  lastSeen: Timestamp;
  estimate?: {
    ticket: string;
    value: number;
  };
};
