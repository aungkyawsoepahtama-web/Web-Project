export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  isComplete: boolean;
  timestamp: number;
}

export enum ConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR',
}

export enum AppMode {
  CONVERSATION = 'CONVERSATION', // AI replies to you
  DICTATION = 'DICTATION',       // AI just transcribes exactly what you say
}

export type Language = 'burmese' | 'english';

export interface BlobData {
  data: string; // Base64
  mimeType: string;
}