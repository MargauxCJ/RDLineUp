import {IonCard, IonContent} from '@ionic/angular/standalone';
import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {ColumnConfig, FilterConfig, TableComponent} from '../../../../_components/table/table.component';
import {AuthService} from '../../../../_services/auth/auth.service';
import {TeamService} from '../../../../_services/api/team.service';
import {filter, switchMap} from 'rxjs';

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
      ]
    },
  ];


  constructor(private authService: AuthService, private teamService: TeamService) {
    this.authService.currentUser$
      .pipe(
        filter(user => !!user),
        switchMap(user => this.teamService.getTeamsByClub(Number(user.teams[0].club.id)))
      )
      .subscribe(teams => {
        const teamFilter = this.filters.find(f => f.key === 'teamId');
        if (teamFilter) {
          teamFilter.options = [
            ...teams.map(t => ({ value: t.id, display: t.name }))
          ];
        }
      });
  }
}
