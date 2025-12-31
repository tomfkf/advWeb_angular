import { Component, inject, Input, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  TranslateService,
  TranslatePipe,
  TranslateDirective
} from "@ngx-translate/core";
import { MobilePostSearch } from "./mobile-post/mobile-post-search/mobile-post-search";
import { MatIconModule } from '@angular/material/icon';
import { MobilePostQueryRequest } from './mobile-post/models/mobile-post-query-request';
import { MobilePostResult } from './mobile-post/mobile-post-result/mobile-post-result';
import { MobilePost } from './mobile-post/models/mobile-post';
import { MobilePostQueryResult } from './mobile-post/models/mobile-post-query-result';
import { MobilePostService } from './mobile-post/services/mobile-post';
import { MobilePostAction } from './mobile-post/models/mobile-post-action-enum';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MobilePostCreate } from './mobile-post/mobile-post-create/mobile-post-create';

@Component({
  selector: 'app-root',
  imports: [MobilePostSearch, MatIconModule, MobilePostResult],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('advWeb-angular');
  private translate = inject(TranslateService);
  queryFilter!: MobilePostQueryRequest | null;
  initMobilePostOption: MobilePost[];
  actionModalDialogRef: MatDialogRef<MobilePostCreate, any> | undefined;
  dialogConfig = new MatDialogConfig();
  refreshTrigger: number = 0;

  constructor(service: MobilePostService, private matDialog: MatDialog) {
    this.translate.addLangs(['en']);
    this.translate.setFallbackLang('en');
    this.translate.use('en');
    this.initMobilePostOption = [];
    service.getAllRecords().subscribe((data: MobilePostQueryResult) => {
      this.initMobilePostOption = data.items || [];
    });
  }

  queryFilterReceiver($event: MobilePostQueryRequest) {
    this.queryFilter = $event;
  }

  mobilePostEventReceiver(event: { action: MobilePostAction, id?: string }) {

    this.dialogConfig.id = "actionModal";


    this.dialogConfig.data = event;

    this.dialogConfig.height = "auto";

    this.dialogConfig.width = "50vw";
    this.dialogConfig.maxWidth = '50vw';
    this.actionModalDialogRef = this.matDialog.open(MobilePostCreate, this.dialogConfig);
    this.actionModalDialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      if (result?.refresh) {
        this.refreshTrigger++;
      } 
    });
  }
}
