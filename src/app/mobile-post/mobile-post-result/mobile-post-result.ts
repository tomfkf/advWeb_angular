import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
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
import { MatSort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-mobile-post-result',
  imports: [MatTableModule, MatPaginatorModule, CommonModule, TranslatePipe, MatIconModule,MatCardModule],
  templateUrl: './mobile-post-result.html',
  styleUrl: './mobile-post-result.css',
})
export class 
MobilePostResult implements OnInit {
  // @Input() result: MobilePostQueryResult = {};
  // dataSource = new MatTableDataSource<MobilePost>(this.result?.items || []);
  mobilePostKey: string[] = Object.keys(new MobilePost());
  // displayedColumns: string[] = [...this.mobilePostKey, 'star'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  createModalDialogRef: MatDialogRef<MobilePostCreate, any> | undefined;
  matDialog: MatDialog;
  dialogConfig = new MatDialogConfig();
  langs: string[] = ['EN', 'TC', 'SC'];
  dataSource!: MobilePostDataSource;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() queryFilter!: MobilePostQueryRequest | null;

  lang: string = 'EN';

  constructor(matDialog: MatDialog, private mobilePostService: MobilePostService) {
    this.matDialog = matDialog;
  }

  ngAfterViewInit(): void {
    this.dataSource = new MobilePostDataSource(this.mobilePostService,this.queryFilter, this.paginator, this.sort);
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

  findDisplayColumnsByLang(): string[] {
    let displayedColumns = this.mobilePostKey.filter(column => { 
      if (column.endsWith(this.lang)) {
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
    return displayedColumns;
  }

  
}
