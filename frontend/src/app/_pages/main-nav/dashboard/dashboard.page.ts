import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonCard, IonContent, IonIcon, IonText} from '@ionic/angular/standalone';
import {AuthService} from '../../../_services/auth/auth.service';
import {addIcons} from 'ionicons';
import {barbell, flag, people, statsChart} from 'ionicons/icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonText, IonCard, IonIcon]
})
export class DashboardPage implements OnInit {

  constructor(public authService: AuthService) {
    addIcons({flag, barbell, people, statsChart})
  }

  ngOnInit() {
  }

}
