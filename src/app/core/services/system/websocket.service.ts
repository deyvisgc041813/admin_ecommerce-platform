// src\app\services\websocket.service.ts
import { Injectable } from "@angular/core";
import { Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
const CHAT_URL = "http://localhost:8001";
import { io, Socket } from 'socket.io-client';
@Injectable()
export class WebsocketService {
  // io = io(CHAT_URL, {
  //     withCredentials: true,
  //     autoConnect: true
  // })
  // @Output() outEven: EventEmitter<any> = new EventEmitter();
  // constructor() {
  // }
  public socket: Socket;

  constructor() {
    this.socket = io(CHAT_URL, {
      transports: ["websocket"],
      autoConnect: true,
    });

    this.socket.on("connect", () => {
      console.log("🟢 Conectado al socket:", this.socket.id);
    });

    this.socket.onAny((event, data) => {
      console.log("📡 Evento recibido:", event);
    });
  }
}
