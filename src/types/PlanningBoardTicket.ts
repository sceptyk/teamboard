import type { Timestamp } from 'firebase/firestore';

export type PlanningBoardTicket = {
  title: string;
  date: Timestamp;
  revealed?: boolean;
  estimate?: number;
};
