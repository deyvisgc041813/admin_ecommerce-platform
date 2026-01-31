
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { UriConstante } from '../../util/UriConstante';
import { WhatssapssRequest } from '@rdinvesiones/core/interface/whatssapp.request';
@Injectable({ providedIn: 'root' })
export class WhatssapService {
  messageServer: any
  // tokenWhatsapp$ = new BehaviorSubject<any | null>(null);
  // private message$ = new Subject<any>();
  private qr$ = new BehaviorSubject<string | null>(null);
  private status$ = new BehaviorSubject<string>('idle');
  constructor(private http: HttpClient, private ws: WebsocketService) {
  }
  generate(whatssapp: WhatssapssRequest): Observable<any> {
      return this.http.post<any>(UriConstante.URL_API_SAVE_SESSION_WHATSSAP, whatssapp);
  }
  getObtenerQr(session:string): Observable<any> {
    return this.http.get<any>(`${UriConstante.URL_API_GET_OBTENER_QR_WHATSSAP}-${session}`);
  }
  // getStatus(session:string): Observable<any> {
  //     let params = new HttpParams()
  //     .set("session", session)
  //   return this.http.get<any>(UriConstante.URL_API_GET_STATUS_WHATSSAP, {params: params});
  // }
  // listen = () => {
  //   this.socketService.io.on(`${UriConstante.URL_API_GET_OBTENER_QR_WHATSSAP}-rydinversiones`, (message:any) => {
  //     this.getMessaje$();
  //   })
  //   this.socketService.io.on("conecction-success", (message:any) => {
  //     this.agregarMessaje$(message);
  //   })
  //   this.socketService.io.on("conecction-deleted", (message:any) => {
  //     this.agregarMessaje$(message);
  //   })
  // }
    listen(sessionId: string) {
    // 📸 QR
    this.ws.socket.on(`qr-${sessionId}`, (qrBase64: string) => {
      if (this.status$.value === 'connected') return;
      console.log('📸 QR recibido');
      this.qr$.next(qrBase64);
      this.status$.next('waiting_qr');
    });

    // ✅ Activa
    // this.ws.socket.on(`session-active-${sessionId}`, () => {
    //   console.log('✅ Sesión conectada');
    //   this.status$.next('connected');
    // });
    
  // Sesión activa
   this.ws.socket.on(`session-active-${sessionId}`, () => {
    console.log('Sesión conectada');
    this.status$.next('connected');
    this.qr$.next(null); // borrar QR
    // dejar de escuchar QR
    this.ws.socket.off(`qr-${sessionId}`);
  });

    // 🔴 Cerrada
    this.ws.socket.on(`session-closed-${sessionId}`, () => {
      console.log('🔴 Sesión cerrada');
      this.status$.next('closed');
    });
    // this.ws.socket.onAny((event, data) => {
    //   console.log('📡 Evento recibido:', event, data);
    // });

  }

  // emitEvent = (payload = {}) => {
  // }
  // agregarMessaje$(message: any) {
  //   this.message$.next(message);
  // }
  // getMessaje$(): Observable<any> {
  //   return this.message$.asObservable();
  // }
   getQR() {
    return this.qr$.asObservable();
  }

  getStatus() {
    return this.status$.asObservable();
  }
}