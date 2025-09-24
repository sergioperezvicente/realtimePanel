import { computed, Injectable, signal } from '@angular/core';
import { WsStatus } from '@app/data/enums/ws-status';
import { ChatRoom } from '@app/data/models/chat-room';
import { MsgIncoming } from '@app/data/models/msg-incoming';
import { environment } from '@env/environment';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WsService {
  private socket?: Socket;

  private _status = signal<WsStatus>(WsStatus.off);
  //private _chatIncoming = signal<MsgIncoming | undefined>(undefined)

  public status = computed(() => this._status());
  // public chatIncoming = computed(() => this._chatIncoming())

  public rooms = signal<ChatRoom[]>([]);

  public connect(token: string) {
    if (this.socket?.connected) return;
    this.socket = io(`${environment.apiUrl}`, {
      transports: ['websocket'],
      auth: { token },
    });
    this.socket.on('connect', () => {
      this._status.set(WsStatus.syncronized);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket desconectado', reason);
      this._status.set(WsStatus.off);
    });

    // this.socket.on('chat-on', (data) => {
    //   this._chatStatus.set(ChatStatus.on);
    //   if (this._chatUsers().length <= 1) {
    //     this.alertsService.showAlert(data.message, AlertColour.success);
    //   }
    // }),
    //   this.socket.on('chat-off', (data) => {
    //     this._chatStatus.set(ChatStatus.off);
    //     this.alertsService.showAlert(data.message, AlertColour.dark);
    //   }),
    this.socket.on('chat-rooms', (data) => {
      this.rooms.set(data.chatrooms);
      
    });
    // this.socket.on('chat-broadcast', (data) => {
    //    //console.log(data);
    //    this._chatIncoming.set(data)
    // });

    // this.socket.on('db:update', (data) => {
    //   this._dbUpdated.set(data.message);
    //   //   console.log('valor db', this.updates());
    // });
  }

  public send(to: string, message: string) {
    const data = { to, message };
    //console.log('chat:', data);
    this.socket?.emit('chat', data);
  }

  public sendBroadcast(message: string) {
    this.socket?.emit('broadcast', message)
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = undefined;
      this._status.set(WsStatus.off);
    }
  }
}
