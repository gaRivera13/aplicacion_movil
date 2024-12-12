import { Component } from '@angular/core';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display : {
    dateInput:'DD/MM/YYYY',
    monthYearLabel:'MM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  
  }
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  providers:[
    {provide: MAT_DATE_LOCALE, useValue: 'es-CL'}
  ]
})
export class AppComponent {

  titulo = 'Asistencia Duoc';
  constructor() {}
}
