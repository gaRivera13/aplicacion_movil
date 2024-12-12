import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Publicacion } from '../model/publicacion';
import { showToast } from '../tools/message-routines';

@Injectable({
  providedIn: 'root'
})
export class APIClientService {

  httpOptions = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'access-control-allow-origin': '*'
    })
  };

  listaPublicaciones: BehaviorSubject<Publicacion[]> = new BehaviorSubject<Publicacion[]>([]);
  //apiUrl = 'http://localhost:3000'; // Url al usar en navegador Web
  apiUrl = 'http://192.168.100.12:3000'; // Url al usar en mi celular en mi WIFI, tu puedes tener otra IP
  
  constructor(private http: HttpClient) { }

  async cargarPublicaciones() {
    this.leerPublicaciones().subscribe({
      next: (publicaciones) => {
        console.log('Publicaciones:', publicaciones); // Verifica aquí
        this.listaPublicaciones.next(publicaciones as Publicacion[]);
      },
      error: (error: any) => {
        showToast('El servicio API Rest de Publicaciones no está disponible');
        this.listaPublicaciones.next([]);
      }
    });
  }
  

  crearPublicacion(publicacion: any): Observable<any> {
    return this.http.post(this.apiUrl + '/publicaciones/', publicacion, this.httpOptions);
  }

  leerPublicaciones(): Observable<any> {
    return this.http.get(this.apiUrl + '/publicaciones/');
  }

  leerPublicacion(idPublicacion: number): Observable<any> {
    return this.http.get(this.apiUrl + '/publicaciones/' + idPublicacion);
  }

  actualizarPublicacion(publicacion: any): Observable<any> {
    return this.http.put(this.apiUrl + '/publicaciones/' + publicacion.id, publicacion, this.httpOptions);
  }

  eliminarPublicacion(publicacionId: string): Observable<any> {
    return this.http.delete(this.apiUrl + '/publicaciones/' + publicacionId, this.httpOptions);
  }

}
