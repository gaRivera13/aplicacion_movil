import { showAlert, showAlertError } from "../tools/message-functions";

export class Asistencia {

  static jsonAsistenciaVacio=
  `{
    "bloqueInicio": "",
    "bloqueTermino": "",
    "dia": "",
    "horaFin": "",
    "horaInicio": "",
    "idAsignatura": "",
    "nombreAsignatura": "",
    "nombreProfesor": "",
    "seccion": "",
    "sede": ""
  }`

  bloqueInicio ='';
  bloqueTermino ='';
  dia ='';
  horaFin ='';
  horaInicio ='';
  idAsignatura='';
  nombreAsignatura='';
  nombreProfesor='';
  seccion='';
  sede='';

  constructor(){}
  public static getAsistencia(
    bloqueInicio: number,
    bloqueTermino: number,
    dia: string,
    horaFin: string,
    horaInicio: string,
    idAsignatura: string,
    nombreAsignatura: string,
    nombreProfesor: string,
    seccion: string,
    sede: string,
  ) {
    const clase = new Asistencia();
    clase.bloqueInicio =  String(bloqueInicio);
    clase.bloqueTermino = String(bloqueTermino);
    clase.dia = dia;
    clase.horaFin = horaFin;
    clase.horaInicio = horaInicio;
    clase.idAsignatura = idAsignatura;
    clase.nombreAsignatura = nombreAsignatura;
    clase.nombreProfesor= nombreProfesor;
    clase.seccion = seccion;
    clase.sede = sede;
    return clase;
  }

  static codigoQrValido (qr: string){
    if (qr ==='') return false;
    try{
      const json = JSON.parse(qr);
      if( json.bloqueInicio !== undefined
        && json.bloqueTermino !== undefined
        && json.dia !==undefined
        && json.horaFin !== undefined
        && json.horaInicio !== undefined
        && json.idAsignatura !== undefined
        && json.nombreAsignatura !== undefined
        && json.nombreProfesor !== undefined
        && json.seccion !== undefined
        && json.sede !== undefined)
        {
          return true;
        }
    } catch(error){ }
    showAlert ('El código QR escaneado no corresponde a una asistencia');
    return false;
  }
}
