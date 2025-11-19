import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  TranslateService,
  TranslatePipe,
  TranslateDirective
} from "@ngx-translate/core";
import { MobilePostSearch } from "./mobile-post/mobile-post-search/mobile-post-search";

@Component({
  selector: 'app-root',
  imports: [ MobilePostSearch],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('advWeb-angular');
  private translate = inject(TranslateService);

  constructor() {
    this.translate.addLangs(['en']);
    this.translate.setFallbackLang('en');
    this.translate.use('en');
  }
}
