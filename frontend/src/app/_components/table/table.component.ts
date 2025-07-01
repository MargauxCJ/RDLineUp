import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ApiService, PaginatedResult } from '../../_services/api/api.service';
import {addIcons} from 'ionicons';
import {chevronForward, search, close} from 'ionicons/icons';
import {RouterLink} from '@angular/router';
import {debounceTime, Subject} from 'rxjs';
import {
  IonButton,
  IonCard,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';

export interface EntityInterface {
  id: string;
  [key: string]: any;
}

export interface ColumnConfig {
  name: string;
  label: string;
  type: 'text' | 'array' | 'custom';
  sublabel?: string;
}

export interface FilterConfig {
  label: string;
  key: string;
  type: 'text' | 'select';
  options?: { value: any; display: string }[]; // pour select uniquement
}

@Component({
  selector: 'app-table',
  standalone: true,
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    RouterLink,
    IonCard,
    IonIcon,
    IonInput,
    IonButton,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
  ]
})
export class TableComponent<Entity extends EntityInterface> implements OnInit {
  @Input() displayedColumnList: ColumnConfig[] = [];
  @Input() filters: FilterConfig[] = [];
  @Input() endpoint: string = '';
  @Input() itemRoute: string;

  public dataSource = new MatTableDataSource<Entity>();
  public totalItems = 0;
  public page = 1;
  public limit = 10;
  public search = '';
  private searchSubject = new Subject<string>();
  public filtersValues: {[key: string]: any} = {};
  private textFilterSubject = new Subject<{ key: string, value: string }>();


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private apiService: ApiService<Entity>) {
    addIcons({chevronForward, search, close})
  }


  ngOnInit() {
    this.textFilterSubject.pipe(
      debounceTime(400)
    ).subscribe(({ key, value }) => {
      this.filtersValues[key] = value;
      this.page = 1;
      this.loadData();
    });

    this.searchSubject.pipe(
      debounceTime(400)
    ).subscribe(searchText => {
      this.search = searchText;
      this.page = 1;
      this.loadData();
    });

    this.loadData();
  }


  loadData(): void {
    const appliedFilters = Object.entries(this.filtersValues)
      .filter(([_, v]) => v !== null && v !== undefined && v !== '')
      .reduce((acc, [k, v]) => {
        acc[k] = v;
        return acc;
      }, {} as Record<string, any>);

    if (this.search) {
      appliedFilters['search'] = this.search;
    }

    this.apiService.getAllPaginated(this.page, this.limit, this.endpoint, appliedFilters)
      .subscribe((result: PaginatedResult<Entity>) => {
        this.dataSource.data = result.data;
        this.totalItems = result.total;
      });
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.loadData();
  }

  displayedColumns(): string[] {
    return [...this.displayedColumnList.map(c => c.label), 'actions'];
  }

  formatArrayColumn(element: Entity, column: ColumnConfig): string {
    const arr = element[column.label];
    if (!Array.isArray(arr)) return '';
    return arr.map(item => item[column.sublabel || '']).join(', ');
  }

  onFilterChange(key: string, value: any) {
    const filter = this.filters.find(f => f.key === key);

    if (filter?.type === 'text') {
      this.textFilterSubject.next({ key, value });
    } else {
      if (value === null || value === undefined || value === '') {
        delete this.filtersValues[key];  // Supprime le filtre si valeur vide
      } else {
        this.filtersValues[key] = value;
      }
      this.page = 1;
      this.loadData();
    }
  }

  clearFilters() {
    this.filtersValues = {};
    this.search = '';
    this.page = 1;
    this.loadData();
  }

}
