import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { ChatMessage, SendMessageDto } from '../models/chat.model';
import { environment } from '../../../environments/environment';
import { ApiResponse } from './task.service';
import { AuthStateService } from './auth-state.service';

@Injectable({ providedIn: 'root' })

export class ChatService {

  private readonly baseUrl = `${environment.apiUrl}/api/chat`;

  private hubConnection: signalR.HubConnection | null = null;

  public messageReceived$ = new Subject<ChatMessage>();
  public triggerPopup$ = new Subject<number | null>();

  // Notification state
  private unreadMessages: ChatMessage[] = [];
  public unreadMessages$ = new Subject<ChatMessage[]>();
  public unreadCount$ = new Subject<number>();

  private unreadCounts: { [key: string]: number } = {};
  public unreadCounts$ = new BehaviorSubject<{ [key: string]: number }>({});

  constructor(private http: HttpClient, private authState: AuthStateService) { }

  public startConnection(): void {

    const token = this.authState.getToken();

    if (!token) return;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/hubs/chat`, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => {
        console.log('SignalR connected');
        this.hubConnection?.invoke('JoinUserGroup').catch(err => console.error('Error joining user group:', err));
      })
      .catch(err => console.error('Error while starting connection: ' + err));

    this.hubConnection.on('ReceiveTeamMessage', (msg: ChatMessage) => {
      this.messageReceived$.next(msg);
      this.handleNewMessage(msg);
    });

    this.hubConnection.on('ReceivePrivateMessage', (msg: ChatMessage) => {
      this.messageReceived$.next(msg);
      this.handleNewMessage(msg);
    });
  }

  private handleNewMessage(msg: ChatMessage) {
    const selfId = this.authState.currentUser()?.userId;
    if (msg.senderId !== selfId) {
      this.unreadMessages.unshift(msg);
      this.unreadMessages$.next(this.unreadMessages);
      this.unreadCount$.next(this.unreadMessages.length);

      const key = msg.isPrivate ? `user_${msg.senderId}` : 'team';
      this.unreadCounts[key] = (this.unreadCounts[key] || 0) + 1;
      this.unreadCounts$.next({ ...this.unreadCounts });
    }
  }

  public openChatPopup(userId?: number) {
    this.triggerPopup$.next(userId || null);
  }

  public clearConversationUnread(key: string) {
    this.unreadCounts[key] = 0;
    this.unreadCounts$.next({ ...this.unreadCounts });

    // Also remove from global unread messages if you wanted to sync them
    this.unreadMessages = this.unreadMessages.filter(m => {
      const mKey = m.isPrivate ? `user_${m.senderId}` : 'team';
      return mKey !== key;
    });
    this.unreadMessages$.next(this.unreadMessages);
    this.unreadCount$.next(this.unreadMessages.length);
  }

  public clearUnread() {
    this.unreadMessages = [];
    this.unreadMessages$.next([]);
    this.unreadCount$.next(0);
    // Note: We don't clear unreadCounts here so sidebar markers persist until clicked
  }

  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }

  getTeamMessages(teamId: number): Observable<ApiResponse<ChatMessage[]>> {
    return this.http.get<ApiResponse<ChatMessage[]>>(`${this.baseUrl}/team/${teamId}`);
  }

  getPrivateMessages(receiverId: number): Observable<ApiResponse<ChatMessage[]>> {
    return this.http.get<ApiResponse<ChatMessage[]>>(`${this.baseUrl}/private/${receiverId}`);
  }

  sendTeamMessage(dto: SendMessageDto): Observable<ApiResponse<ChatMessage>> {
    return this.http.post<ApiResponse<ChatMessage>>(`${this.baseUrl}/team`, dto);
  }

  sendPrivateMessage(receiverId: number, dto: SendMessageDto): Observable<ApiResponse<ChatMessage>> {
    return this.http.post<ApiResponse<ChatMessage>>(`${this.baseUrl}/private/${receiverId}`, dto);
  }

  getOnlineTeamMembers(): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/online`);
  }

  connectUser(connectionId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/connect`, { connectionId });
  }

  disconnectUser(connectionId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/disconnect`, { connectionId });
  }
}
