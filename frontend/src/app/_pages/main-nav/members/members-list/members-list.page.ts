import {IonCard, IonContent} from '@ionic/angular/standalone';
import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {ColumnConfig, FilterConfig, TableComponent} from '../../../../_components/table/table.component';
import {AuthService} from '../../../../_services/auth/auth.service';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.page.html',
  styleUrls: ['./members-list.page.scss'],
  standalone: true,
  imports: [
    IonContent, CommonModule, IonCard, TableComponent
  ]
})
export class MembersListPage {
  public currentUser$ = this.authService.currentUser$;
  public displayedColumnList: ColumnConfig[] = [
    { name: 'Nom', label: 'surname', type: 'text' },
    { name: 'Equipe(s)', label: 'teams', type: 'array', sublabel: 'name' },
    { name: 'Position par défaut', label: 'defaultPosition', type: 'text' },
    { name: 'Email', label: 'email', type: 'text' },
  ];
  public filters: FilterConfig[] = [
    { label: 'Nom', key: 'search', type: 'text' },
    {
      label: 'Équipe(s)',
      key: 'teamId',
      type: 'select',
      options: [
        { value: '1', display: 'Léopard Avengers' },
        { value: '2', display: 'Les pétroleuses' },
      ]
    },
  ];


  constructor(private authService: AuthService) {

  }
}
