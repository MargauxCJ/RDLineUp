import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { chevronForward, close, search } from 'ionicons/icons';
import { RouterLink } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';
import { IonButton, IonCard, IonIcon, IonInput, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { ImagesService } from '../../_services/images.service';

export interface EntityInterface {
  id: string;
  [key: string]: any;
}

export interface ColumnConfig {
  name: string;
  label: string;
  type: 'text' | 'array' | 'custom' | 'image' | 'enabled';
  sublabel?: string;
}

export interface FilterConfig {
  label: string;
  key: string;
  type: 'text' | 'select';
  options?: { value: any; display: string }[];
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
    IonSelect,
    IonSelectOption,
  ]
})
export class TableComponent<Entity extends EntityInterface> implements OnInit {
  @Input() displayedColumnList: ColumnConfig[] = [];
  @Input() filters: FilterConfig[] = [];
  @Input() itemRoute: string;

  @Output() loadDataEvent = new EventEmitter<{ page: number; limit: number; filters: { [key: string]: any } }>();

  public dataSource = new MatTableDataSource<Entity>();
  public totalItems = 0;
  public page = 1;
  public limit = 10;

  public filtersValues: { [key: string]: any } = {};

  private textFilterSubject = new Subject<{ key: string; value: string }>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public imagesService: ImagesService) {
    addIcons({ chevronForward, search, close });
  }

  ngOnInit() {
    this.textFilterSubject.pipe(debounceTime(400)).subscribe(({ key, value }) => {
      this.filtersValues[key] = value;
      this.page = 1;
      this.emitLoadData();
    });

    // Initial load
    this.emitLoadData();
  }

  emitLoadData() {
    this.loadDataEvent.emit({
      page: this.page,
      limit: this.limit,
      filters: this.cleanFilters(this.filtersValues),
    });
  }

  cleanFilters(filters: { [key: string]: any }): { [key: string]: any } {
    return Object.entries(filters)
      .filter(([_, v]) => v !== null && v !== undefined && v !== '')
      .reduce((acc, [k, v]) => {
        acc[k] = v;
        return acc;
      }, {} as { [key: string]: any });
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.emitLoadData();
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
        delete this.filtersValues[key];
      } else {
        this.filtersValues[key] = value;
      }
      this.page = 1;
      this.emitLoadData();
    }
  }

  clearFilters() {
    this.filtersValues = {};
    this.page = 1;
    this.emitLoadData();
  }
}
