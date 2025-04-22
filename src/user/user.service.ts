import { Injectable } from '@nestjs/common';
import { UserSession } from './interfaces/user.interface';

@Injectable()
export class UserService {
  private users = new Map<string, UserSession>();

  createUser(socketId: string, name?: string): UserSession {
    const user: UserSession = {
      id: socketId,
      name: name || this.generateRandomName(),
      joinedAt: Date.now(),
    };
    this.users.set(socketId, user);
    return user;
  }

  getUser(socketId: string): UserSession | undefined {
    return this.users.get(socketId);
  }

  removeUser(socketId: string): void {
    this.users.delete(socketId);
  }

  private generateRandomName(): string {
    const adjectives = ['Cool', 'Curious', 'Fast', 'Brave'];
    const animals = ['Otter', 'Fox', 'Panda', 'Koala'];
    return `${this.pick(adjectives)}${this.pick(animals)}${Math.floor(Math.random() * 100)}`;
  }

  private pick(arr: string[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
