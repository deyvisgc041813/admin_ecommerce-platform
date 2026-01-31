import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { WhatssapssRequest } from "@rdinvesiones/core/interface/whatssapp.request";
import { WhatssapService } from "@rdinvesiones/core/services/system/whatssapp.service";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { TokenService } from "src/app/core";
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
  sessionWhatsapp = "rydinversiones";
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
    sessionId: ""
  };
  constructor(
    private formBuilder: FormBuilder,
    public whatssapService: WhatssapService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private tokenService: TokenService,
  ) {
    this.KEY_SESSION_WHATSAPP = "session";
    const session = this.getStorageSession() as WhatssappConfig | null;
    this.configWhatssap.sessionId = session?.sessionId ?? "rydinversiones";
    this.configWhatssap.isConnect = session?.isConnect ?? false;
    if(!this.configWhatssap.isConnect) this.generateSession();
  }

  ngOnInit(): void {

    this.whatssapService.listen(this.configWhatssap.sessionId);
    this.getObtenerQr()
    this.getStatusConnect()
  }

  generateSession() {
    const request: WhatssapssRequest = {
      sessionId: this.sessionWhatsapp,
      //number: this.formGrup.value.celular.replace(/\s/g, "")
    };
    this.whatssapService.generate(request).subscribe(
      (res) => {
        if (res.ok) {
          this.toastr.success(res.message, "Exito!");
          this.addStorageSession();
          //this.qrBase64 = this.sanitizer.bypassSecurityTrustResourceUrl(`${res.data.qr}`);
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
      //console.log("status ", status)
      if (status === "connected") {
        this.configWhatssap.isConnect = true;
      } else if(status === "closed" || status === "waiting_qr") {
        this.configWhatssap.isConnect = false;
      }
      this.addStorageSession();
    });
  }
  getObtenerQr() {
    this.whatssapService.getQR().subscribe((qr) => {
      this.qr = qr;
    });
  }
  // setearDevice(res) {
  //     this.isQrConnect = true
  //     this.isQr = true
  //     this.device.session = res.session
  //     this.device.number = res.number
  //     this.device.status = res.status
  // }
  // addMesage() {
  //   this.whatssapService.getMessaje$().subscribe(res => {
  //     this.getObtenerQr()
  //     // console.log("res", res)
  //     // if(res && res.type === "connected") {
  //     //   this.isQr = true
  //     //   this.isQrConnect = true
  //     //   this.tokenService.saveTokenApi(res.token)

  //     // } else {
  //     //   this.isQr = false
  //     //   this.isQrConnect = false
  //     //   this.device.session = "",
  //     //   this.device.number = ""
  //     //   this.device.status = "disconnected"
  //     // }
  //   });
  // }
  // getMessage() {
  //   this.whatssapService.getMessaje$().subscribe(res => {
  //     this.getObtenerQr()
  //     // console.log("res", res)
  //     // if(res && res.type === "connected") {
  //     //   this.isQr = true
  //     //   this.isQrConnect = true
  //     //   this.tokenService.saveTokenApi(res.token)

  //     // } else {
  //     //   this.isQr = false
  //     //   this.isQrConnect = false
  //     //   this.device.session = "",
  //     //   this.device.number = ""
  //     //   this.device.status = "disconnected"
  //     // }
  //   });
  // }
}
