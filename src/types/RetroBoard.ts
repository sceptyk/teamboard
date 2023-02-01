import type { Timestamp } from 'firebase/firestore';

export type RetroBoard = {
  name: string;
  date: Timestamp;
  revealed?: boolean;
};
