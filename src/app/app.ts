import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MobilePostCreate } from './mobile-post/mobile-post-create/mobile-post-create';
import {
  TranslateService,
  TranslatePipe,
  TranslateDirective
} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  imports: [MobilePostCreate],
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
