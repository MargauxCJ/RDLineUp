import { IonButton, IonCard, IonContent, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ColumnConfig, FilterConfig, TableComponent } from '../../../../_components/table/table.component';
import { AuthService } from '../../../../_services/auth/auth.service';
import { TeamService } from '../../../../_services/api/team.service';
import { filter, switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';
import {PaginatedResult} from '../../../../_services/api/api.service';
import {User} from '../../../../_entities/users/user.model';
import {MemberStoreService} from '../../../../_stores/members.store';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.page.html',
  styleUrls: ['./members-list.page.scss'],
  standalone: true,
  imports: [
    IonContent, CommonModule, IonCard, TableComponent, IonButton, IonIcon, RouterLink
  ]
})
export class MembersListPage implements OnInit {
  @ViewChild(TableComponent) tableComponent!: TableComponent<User>;

  public currentUser$ = this.authService.currentUser$;

  public displayedColumnList: ColumnConfig[] = [
    { name: 'Nom', label: 'surname', type: 'text' },
    { name: 'Equipe(s)', label: 'teams', type: 'array', sublabel: 'name' },
    { name: 'Position par défaut', label: 'defaultPosition', type: 'text' },
    { name: 'Email', label: 'email', type: 'text' },
    { name: 'Status', label: 'enabled', type: 'enabled' }
  ];

  public filters: FilterConfig[] = [
    { label: 'Nom', key: 'search', type: 'text' },
    { label: 'Équipe(s)', key: 'teamId', type: 'select', options: [] },
    { label: 'Exclure les joueur.euse.s désactivé.e.s', key: 'status', type: 'checkbox', default : true}
  ];

  constructor(
    private authService: AuthService,
    private teamService: TeamService,
    private memberStore: MemberStoreService
  ) {}

  ngOnInit() {
    this.authService.currentUser$
      .pipe(
        filter(user => !!user),
        switchMap(user => this.teamService.getTeamsByClub(Number(user.teams[0].club.id)))
      )
      .subscribe(teams => {
        const teamFilter = this.filters.find(f => f.key === 'teamId');
        if (teamFilter) {
          teamFilter.options = teams.map(t => ({ value: t.id, display: t.name }));
        }
      });

    this.memberStore.loadMembers();

    this.memberStore.members$.subscribe((members: User[]) => {
      if (this.tableComponent) {
        this.tableComponent.dataSource.data = members;
      }
    });

    this.memberStore.pagination$.subscribe((pagination) => {
      if (this.tableComponent) {
        this.tableComponent.totalItems = pagination.total;
        this.tableComponent.page = pagination.page;
        this.tableComponent.limit = pagination.limit;
      }
    });
  }

  onLoadData(page: number, limit: number, filters: { [key: string]: any }) {
    this.memberStore.loadMembers(page, limit, filters);
  }
}
