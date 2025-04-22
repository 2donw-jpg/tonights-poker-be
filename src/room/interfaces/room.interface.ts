import { UserSession } from '../../user/interfaces/user.interface';

export interface Room {
  id: string;
  name: string;
  createdAt: number;
  users: UserSession[];
  topics: String[];
  votesValues: Number[];
  votes: Record<string, string | null>; 
  isRevealed: boolean;
}
