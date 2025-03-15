import Dexie, { Table } from 'dexie';
import { SavedPortrait } from '@/types/portrait';

export class PortraitDatabase extends Dexie {
  portraits!: Table<SavedPortrait>;

  constructor() {
    super('portraitDB');
    this.version(1).stores({
      portraits: '++id, createdAt, birthData.firstName, birthData.lastName'
    });
  }
} 