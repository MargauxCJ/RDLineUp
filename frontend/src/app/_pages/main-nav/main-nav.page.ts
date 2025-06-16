import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonContent, IonIcon, IonRouterOutlet} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {barbell, calendar, flag, grid, people, power, settings, statsChart} from 'ionicons/icons';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../_services/auth/auth.service';
import {ImagesService} from '../../_services/images.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.page.html',
  styleUrls: ['./main-nav.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonRouterOutlet, IonContent, IonIcon, RouterLinkActive, RouterLink]
})
export class MainNavPage  {
  constructor(public authService: AuthService, public imagesService: ImagesService) {
    addIcons({ calendar, grid, flag, barbell, people, statsChart, settings, power })
  }
}
