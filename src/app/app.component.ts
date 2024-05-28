import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { HomePage } from './home/home.page';
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, HomePage, NgxSonnerToaster],
})
export class AppComponent {
  constructor() {}
}
