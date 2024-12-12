import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { IonIcon, IonButton, IonCol, IonContent } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import jsQR, { QRCode } from 'jsqr';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Importar Router
import { addIcons } from 'ionicons';
import { videocamOutline, stopCircleOutline, trashOutline} from 'ionicons/icons';
import { LanguageComponent } from '../language/language.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-codigoqr',
  templateUrl: './codigoqr.component.html',
  styleUrls: ['./codigoqr.component.scss'],
  standalone: true,
  imports: [IonCol, IonButton, IonIcon, CommonModule, FormsModule, IonContent,TranslateModule]
})
export class CodigoqrComponent implements OnDestroy {

  @ViewChild('video') private video!: ElementRef;
  @ViewChild('canvas') private canvas!: ElementRef;
  @Output() scanned: EventEmitter<string> = new EventEmitter<string>();
  @Output() stopped: EventEmitter<void> = new EventEmitter<void>();
 // @Output() qrScanCompleted = new EventEmitter<string>(); // New EventEmitter

 qrData: string = '';
 mediaStream: MediaStream | null = null;

  constructor() 
  {
    this.comenzarEscaneoWeb();
    addIcons ({ stopCircleOutline,videocamOutline, trashOutline })

  }
  
  async comenzarEscaneoWeb() {
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {facingMode: 'environment'}
    });
    this.video.nativeElement.srcObject = this.mediaStream;
    this.video.nativeElement.setAttribute('playsinline', 'true');
    this.video.nativeElement.play();
    requestAnimationFrame(this.verificarVideo.bind(this));
  }


  async verificarVideo() {
    if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
      if (this.obtenerDatosQR()) return;
      requestAnimationFrame(this.verificarVideo.bind(this));
    } else {
      requestAnimationFrame(this.verificarVideo.bind(this));
    }
  }

  obtenerDatosQR(): boolean {
    const w: number = this.video.nativeElement.videoWidth;
    const h: number = this.video.nativeElement.videoHeight;
    this.canvas.nativeElement.width = w;
    this.canvas.nativeElement.height = h;
    const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
    context.drawImage(this.video.nativeElement, 0, 0, w, h);
    const img: ImageData = context.getImageData(0, 0, w, h);
    let qrCode: QRCode | null = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' });
    if (qrCode) {
      const data = qrCode.data;
      if (data !== ''){
        this.detenerCamara();
        this.scanned.emit(qrCode.data);
        return true;
      }
    }
    
    return false;
  }


  public detenerEscaneoQR(): void {
    this.detenerCamara();
    this.stopped.emit();
  }

  ngOnDestroy(){
    this.detenerCamara();
  }

  detenerCamara(){
    if (this.mediaStream){
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
  }

  
  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;
}