import { DataSource } from '@angular/cdk/table';
import { MobilePost } from '../models/mobile-post';
import { MobilePostQueryRequest } from '../models/mobile-post-query-request';
import { MobilePostService } from '../services/mobile-post';
import { CollectionViewer } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export class MobilePostDataSource extends DataSource<MobilePost> {
  private mobilePostSubject = new BehaviorSubject<MobilePost[]>([]);
  ready: boolean = false;

  queryFilter: MobilePostQueryRequest | null = null;
  paginator: MatPaginator = new MatPaginator(new HttpClient({} as any), {});
  sort: MatSort = new MatSort();

  override connect(collectionViewer: CollectionViewer): Observable<readonly MobilePost[]> {
    return this.mobilePostSubject.asObservable();
  }
  override disconnect(collectionViewer: CollectionViewer): void {
    this.mobilePostSubject.complete();
  }

 /* constructor(
    private readonly mobilePostService: MobilePostService,
    private queryFilter: MobilePostQueryRequest | null,
    private paginator: MatPaginator,
    private sort: MatSort
  ) {
    super();
    this.paginator.page.subscribe(() => { console.log('Page changed'); this.updateDataFromServer(); });
    this.updateDataFromServer();
    // this.paginator.page.subscribe(() => {console.log('Page changed'); this.dataSource.updateDataFromServer();});


    if (this.sort) {
      console.log('Sort initialized');
      this.sort.sortChange.subscribe(() => {
        this.paginator.pageIndex = 0;
        this.updateDataFromServer();
      });
    } else {
      console.log('Sort not initialized');
    }
  }*/

  constructor(private readonly mobilePostService: MobilePostService) {
    super();
  }


  setUp(queryFilter: MobilePostQueryRequest | null, paginator: MatPaginator, sort: MatSort): void {
    this.queryFilter = queryFilter;
    this.paginator = paginator;
    this.sort = sort;
    this.paginator.page.subscribe(() => { console.log('Page changed'); this.updateDataFromServer(); });
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.updateDataFromServer();
    });
    this.updateDataFromServer();
  }

  updateDataFromServer(): void {
    console.log('Fetching data from server with pagination and sorting...');
    console.log(this.queryFilter);
    let queryFilter = this.queryFilter == null ? new MobilePostQueryRequest() : { ...this.queryFilter };
    queryFilter.limit = this.paginator.pageSize;
    queryFilter.page = this.paginator.pageIndex + 1;
    if (this.sort?.active && this.sort?.direction) {
      queryFilter.orderBy = this.sort?.active;
      queryFilter.order = this.sort?.direction.toUpperCase();
    }

    // console.log(`paginator : ${this.sort.direction}`);
    this.mobilePostService.getRecord(queryFilter).subscribe((data) => {
      this.mobilePostSubject.next(data.items || []);
      this.paginator.length = data.meta?.totalItems || 0;
      this.ready = true;
    });
  }

  setQueryFilter(queryFilter: MobilePostQueryRequest | null): void {
    this.queryFilter = queryFilter;
    this.paginator.pageIndex = 0;
  }

}
