import { User } from '@/context/auth/AuthContext';

declare global {
  var user: User | null | undefined;
}

export {};
