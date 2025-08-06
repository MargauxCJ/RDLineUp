import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonButton, IonContent} from '@ionic/angular/standalone';
import {ColumnConfig, FilterConfig, TableComponent} from '../../../../_components/table/table.component';
import {Event} from '../../../../_entities/events/event.model';
import {AuthService} from '../../../../_services/auth/auth.service';
import {TeamService} from '../../../../_services/api/team.service';
import {EventsStoreService} from '../../../../_stores/events.store';
import {filter, switchMap} from 'rxjs';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.page.html',
  styleUrls: ['./events-list.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonButton, TableComponent, RouterLink]
})
export class EventsListPage implements OnInit {
  @ViewChild(TableComponent) tableComponent!: TableComponent<Event>;

  public currentUser$ = this.authService.currentUser$;

  public displayedColumnList: ColumnConfig[] = [
    { name: 'Nom', label: 'name', type: 'text' },
    { name: 'Début', label: 'startDate', type: 'date'},
    { name: 'Fin', label: 'endDate', type: 'date' },
    { name: 'Equipe(s)', label: 'teams', type: 'array', sublabel: 'name' },
  ];

  public filters: FilterConfig[] = [
    { label: 'Nom', key: 'search', type: 'text' },
    { label: 'Équipe(s)', key: 'teamId', type: 'select', options: [] }
  ];

  constructor(
    private authService: AuthService,
    private teamService: TeamService,
    private eventStore: EventsStoreService
  ) {}

  ngOnInit() {
    this.authService.currentUser$
      .pipe(
        filter(event => !!event),
        switchMap(event => this.teamService.getTeamsByClub(Number(event.teams[0].club.id)))
      )
      .subscribe(teams => {
        const teamFilter = this.filters.find(f => f.key === 'teamId');
        if (teamFilter) {
          teamFilter.options = teams.map(t => ({ value: t.id, display: t.name }));
        }
      });

    this.eventStore.loadEvents();

    this.eventStore.events$.subscribe((events: Event[]) => {
      if (this.tableComponent) {
        this.tableComponent.dataSource.data = events;
      }
    });

    this.eventStore.pagination$.subscribe((pagination) => {
      if (this.tableComponent) {
        this.tableComponent.totalItems = pagination.total;
        this.tableComponent.page = pagination.page;
        this.tableComponent.limit = pagination.limit;
      }
    });
  }

  onLoadData(page: number, limit: number, filters: { [key: string]: any }) {
    this.eventStore.loadEvents(page, limit, filters);
  }

}
