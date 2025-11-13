import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MobilePostQueryResult } from '../models/mobile-post-query-result';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MobilePost } from '../models/mobile-post';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-mobile-post-result',
  imports: [MatTableModule, MatPaginatorModule, CommonModule, TranslatePipe],
  templateUrl: './mobile-post-result.html',
  styleUrl: './mobile-post-result.css',
})
export class MobilePostResult implements OnChanges {
  @Input() result: MobilePostQueryResult = {};
  dataSource = new MatTableDataSource<MobilePost>(this.result?.items || []);
  displayedColumns: string[] = Object.keys(new MobilePost());

  @ViewChild(MatPaginator) paginator!: MatPaginator ;


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['result'] && this.result) {
      this.dataSource.data = this.result.items || [];

    }
  }


}
