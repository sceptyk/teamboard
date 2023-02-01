import type { RetroBoardCardType } from '@/types/RetroBoardCardType';

export type RetroBoardCard = {
  text: string;
  type: RetroBoardCardType;
  author: string;
  votes: string[];
};
