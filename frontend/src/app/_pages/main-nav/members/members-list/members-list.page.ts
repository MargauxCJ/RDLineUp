import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonCard, IonCol, IonContent, IonFabButton, IonGrid, IonIcon, IonRow} from '@ionic/angular/standalone';
import {AuthService} from '../../../../_services/auth/auth.service';
import {RouterLink} from '@angular/router';
import {ApiService} from '../../../../_services/api.service';
import {Observable} from 'rxjs';
import {User} from '../../../../_entities/users/user.model';
import {addIcons} from 'ionicons';
import {chevronBack, chevronForward, eye, pencil, trash} from 'ionicons/icons';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.page.html',
  styleUrls: ['./members-list.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonCard, IonGrid, IonRow, IonCol, IonIcon, RouterLink, IonFabButton]
})
export class MembersListPage implements OnInit {
  public members$: Observable<User[]>;
  constructor(public authService: AuthService, private apiService: ApiService) {
    addIcons({chevronBack, chevronForward, pencil, eye, trash})
    this.members$ = this.apiService.getUsers();
  }

  ngOnInit() {
  }

}
