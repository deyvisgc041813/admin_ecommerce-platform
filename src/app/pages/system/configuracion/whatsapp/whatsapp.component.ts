import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { WhatssapssRequest } from "@rdinvesiones/core/interface/whatssapp.request";
import { ConfigurationsService } from "@rdinvesiones/core/services/system/configurations.service";
import { WhatssapService } from "@rdinvesiones/core/services/system/whatssapp.service";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { EESTADO, TokenService } from "src/app/core";
export interface WhatssappConfig {
  isConnect: any;
  sessionId: string;
}
@Component({
  selector: "app-whatsapp",
  templateUrl: "./whatsapp.component.html",
  styleUrls: ["./whatsapp.component.scss"],
})
export class WhatsappComponent implements OnInit {
  socket$: Observable<any>;
  info = this.tokenService.decodeToken();
  KEY_SESSION_WHATSAPP: string;
  sessionLocalStorage = sessionStorage.getItem("session")
    ? sessionStorage.getItem("session")
    : "";
  formGrup: FormGroup;
  submitted = false;
  isQr = false;
  qrBase64: any;
  products: Observable<any>;
  isIntervalo = 0;
  session = "";
  sessionWhatsapp = `rydinversiones`;
  sent = [];
  device = {
    session: "00000",
    number: "no definido",
    status: "disconnected",
  };
  qr: string | null = null;
  status = "";
  configWhatssap: WhatssappConfig = {
    isConnect: false,
    sessionId: "",
  };
  private statusUpdated = false;
  constructor(
    public whatssapService: WhatssapService,
    private toastr: ToastrService,
    private tokenService: TokenService,
    private configurationService: ConfigurationsService,
  ) {
    this.KEY_SESSION_WHATSAPP = "session";
    const session = this.getStorageSession() as WhatssappConfig | null;
    this.configWhatssap.sessionId = session?.sessionId ?? this.sessionWhatsapp;
    this.configWhatssap.isConnect = session?.isConnect ?? false;
    if (!this.configWhatssap.isConnect) this.generateSession();
  }

  ngOnInit(): void {
    this.whatssapService.listen(this.configWhatssap.sessionId);
    this.getObtenerQr();
    this.getStatusConnect();

  }


  addStorageSession() {
    sessionStorage.setItem(
      this.KEY_SESSION_WHATSAPP,
      JSON.stringify(this.configWhatssap),
    );
  }
  getStorageSession(): WhatssappConfig | null {
    const session = sessionStorage.getItem(this.KEY_SESSION_WHATSAPP);
    if (!session || session === "undefined") {
      return null;
    }

    try {
      return JSON.parse(session);
    } catch (error) {
      console.error("Error al parsear sesión WhatsApp:", error);
      sessionStorage.removeItem(this.KEY_SESSION_WHATSAPP);
      return null;
    }
  }
  getStatusConnect() {
    this.whatssapService.getStatus().subscribe((status) => {
      console.log("status ", status)
      if (status === "connected") {
        if (this.statusUpdated) return;
        this.configWhatssap.isConnect = true;
        this.updateConnectWhatsapp(EESTADO.ACTIVE, this.configWhatssap.sessionId)
        this.statusUpdated = true
      } else if (status === "closed") {
        this.configWhatssap.isConnect = false;
        this.statusUpdated = false
        this.updateConnectWhatsapp(EESTADO.INACTIVE, this.configWhatssap.sessionId)
      }
      this.addStorageSession();
    });
  }
  getObtenerQr() {
    this.whatssapService.getQR().subscribe((qr) => {
      this.qr = qr;
  
    });
  }
  updateConnectWhatsapp(connect: string, session:string) {
    const data = this.tokenService.decodeToken();
    const companyId = data?.user?.company_id ?? data?.company_id;
    return this.configurationService.updateConnectWhatsapp(companyId, connect, session).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message, "Exito!");
        if(connect === EESTADO.INACTIVE) {
          this.generateSession()
        }
      },
      error: (err: any) => {
        this.toastr.success(err.message, "Error!");
      },
      complete: () => {
      },
    });
  }
  updateSessionWhatsapp(session:string) {
    const data = this.tokenService.decodeToken();
    const companyId = data?.user?.company_id ?? data?.company_id;
    return this.configurationService.updateSessionWhatsapp(companyId, session)
    .subscribe({
      next: (res: any) => {
        this.toastr.success(res.message, "Exito!");
      },
      error: (err: any) => {
        this.toastr.success(err.message, "Error!");
      },
      complete: () => {
      },
    });
  }
    generateSession() {
    const request: WhatssapssRequest = {
      sessionId: this.sessionWhatsapp,
    };
    this.whatssapService.generate(request).subscribe(
      (res) => {
        if (res.ok) {
          this.toastr.success(res.message, "Exito!");
          this.addStorageSession();
          this.updateSessionWhatsapp(request.sessionId)
        } else {
          console.log("res ", res);
          this.toastr.error(res.message, "Error!");
        }
      },
      (error) => {
        this.toastr.error(error.message, "Error!");
      },
    );
  }
}
