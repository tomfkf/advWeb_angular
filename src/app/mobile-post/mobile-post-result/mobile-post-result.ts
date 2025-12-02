import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MobilePostQueryResult } from '../models/mobile-post-query-result';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MobilePost } from '../models/mobile-post';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MobilePostCreate } from '../mobile-post-create/mobile-post-create';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MobilePostDataSource } from '../dataSource/mobile-post-data-source';
import { MobilePostService } from '../services/mobile-post';
import { MobilePostQueryRequest } from '../models/mobile-post-query-request';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MobilePostAction } from '../models/mobile-post-action-enum';


@Component({
  selector: 'app-mobile-post-result',
  imports: [MatTableModule, MatPaginatorModule, CommonModule, TranslatePipe, MatIconModule, MatCardModule, MatButtonModule, MatCardModule, MatChipsModule, MatButtonToggleModule, MatMenuModule, MatSortModule],
  templateUrl: './mobile-post-result.html',
  styleUrl: './mobile-post-result.css',
})
export class
  MobilePostResult implements OnInit {
  // @Input() result: MobilePostQueryResult = {};
  // dataSource = new MatTableDataSource<MobilePost>(this.result?.items || []);
  mobilePostKey: string[] = Object.keys(new MobilePost());
  displayedColumns: string[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  createModalDialogRef: MatDialogRef<MobilePostCreate, any> | undefined;
  matDialog: MatDialog;
  dialogConfig = new MatDialogConfig();
  langs: string[] = ['EN', 'TC', 'SC'];
  dataSource!: MobilePostDataSource;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() queryFilter!: MobilePostQueryRequest | null;

  lang: string = 'EN';

  smallDisplayColumns: string[];
  mediumDisplayColumns: string[];
  largeDisplayColumns: string[];
  MobilePostAction = MobilePostAction;
  @Output() mobilePostEvent = new EventEmitter<{ action: MobilePostAction, id: string }>();

  constructor(matDialog: MatDialog, private mobilePostService: MobilePostService) {
    this.matDialog = matDialog;
    this.displayedColumns = this.findDisplayColumnsByLang(this.lang);
    this.smallDisplayColumns = ['id']
    this.largeDisplayColumns = this.mobilePostKey.filter(column => column.toLocaleLowerCase().includes('address'));
    this.mediumDisplayColumns = this.mobilePostKey.filter(column => !this.smallDisplayColumns.includes(column) && !this.largeDisplayColumns.includes(column));
    this.dataSource = new MobilePostDataSource(this.mobilePostService);
  }

  ngAfterViewInit(): void {
    // this.dataSource = new MobilePostDataSource(this.mobilePostService, this.queryFilter, this.paginator, this.sort);
    console.log('Paginator and Sort initialized in ngAfterViewInit');
    this.dataSource.setUp(this.queryFilter, this.paginator, this.sort);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['queryFilter'] && this.queryFilter) {
      this.dataSource.setQueryFilter(this.queryFilter);
      this.dataSource.updateDataFromServer();
    }
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  openCreateModal() {
    this.dialogConfig.id = 'createModal';
    this.dialogConfig.height = '500px';
    this.dialogConfig.width = '650px';
    this.createModalDialogRef = this.matDialog.open(MobilePostCreate, this.dialogConfig);
  }

  findDisplayColumnsByLang(lang: string): string[] {
    let displayedColumns = this.mobilePostKey.filter(column => {
      if (column.endsWith(lang)) {
        return true;
      }
      let hasLang = false;
      this.langs.forEach(l => {
        if (column.endsWith(l)) {
          hasLang = true;
        }
      });
      return !hasLang;
    });
    return [...displayedColumns, 'action'];
  }

  toggleColumn(column: string) {
    // const index = this.displayedColumns.indexOf(column);
    // if (index >= 0) {
    //   this.displayedColumns.splice(index, 1);
    // } else {
    //   this.displayedColumns.push(column);
    // }
    this.displayedColumns = this.mobilePostKey.filter(key => {
      return column === key ? !this.displayedColumns.includes(column) : this.displayedColumns.includes(key);
    });

    this.displayedColumns = [...this.displayedColumns, 'action'];
  }

  actionHandler(action: MobilePostAction, id: string) {
    console.log('Action:', MobilePostAction[action], 'ID:', id);
    this.mobilePostEvent.emit({ action, id });
  }

  sortData(event: any) {
    console.log('Sort Event:', event);
  }
}
