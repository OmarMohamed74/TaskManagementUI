export interface ChatMessage {
  id: number;
  content: string;
  senderId: number;
  senderName: string;
  receiverId?: number;
  teamId?: number;
  sendAt: string;
  isPrivate: boolean;
}

export interface SendMessageDto {
  content: string;
  receiverId?: number;
  teamId?: number;
  isPrivate: boolean;
}
