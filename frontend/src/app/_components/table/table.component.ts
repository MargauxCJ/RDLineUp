import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {
  MatPaginator
} from '@angular/material/paginator';
import {
  MatSort
} from '@angular/material/sort';
import {
  MatCell, MatCellDef,
  MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {ApiService} from '../../_services/api/api.service';
import {EntityInterface} from '../../_entities/entity';
import {RouterLink} from '@angular/router';
import {IonIcon} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {chevronForward} from 'ionicons/icons';

export interface ColumnConfig {
  name: string;
  label: string;
  type: 'text' | 'object' | 'array' | 'actions';
  sublabel?: string;
}
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  imports: [
    MatPaginator, MatSort, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCell, RouterLink, IonIcon, MatCellDef, MatHeaderRow, MatRow, MatRowDef, MatHeaderRowDef
  ]
})
export class TableComponent<Entity extends EntityInterface> implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, { static: false }) public paginator: MatPaginator;
  @ViewChild(MatSort) public sort: MatSort;
  public dataSource = new MatTableDataSource<Entity>();
  public columnName: string[] = [];

  @Input() public displayedColumns: ColumnConfig[];
  @Input() public itemRoute?: string = '';
  @Input() public apiEndpoint: string;
  public totalCount: number = 0;

  constructor(private apiService: ApiService<Entity>) {
    addIcons({chevronForward})
  }

  ngOnInit() {
    if (!this.displayedColumns.find(c => c.type === 'actions')) {
      this.displayedColumns.push({name: '', label: 'actions', type: 'actions'});
    }

    this.displayedColumns.forEach((column) => {
      this.columnName.push(column.label);
    });
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit called', this.paginator);
    setTimeout(() => {
      console.log('inside setTimeout', this.paginator);
      if (this.paginator) {
        this.loadPage(1, 10);
        this.paginator.page.subscribe(() => {
          this.loadPage(this.paginator.pageIndex + 1, this.paginator.pageSize);
        });
      } else {
        console.warn('Paginator is undefined!');
      }
    });
  }

  private loadPage(page: number, size: number): void {
    this.apiService.getAllPaginated(page, size, this.apiEndpoint)
      .subscribe({
        next: (res) => {
          this.dataSource.data = res.data;
          this.totalCount = res.total;
        },
        error: () => {
          this.dataSource.data = [];
          this.totalCount = 0;
        }
      });
  }
}
