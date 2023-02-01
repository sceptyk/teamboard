import type { Timestamp } from 'firebase/firestore';

export type PlanningBoard = {
  name: string;
  date: Timestamp;
  activeTicket?: string;
  settings?: {};
};
