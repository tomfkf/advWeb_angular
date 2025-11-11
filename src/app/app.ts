import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MobilePostCreate } from './mobile-post/mobile-post-create/mobile-post-create';

@Component({
  selector: 'app-root',
  imports: [MobilePostCreate],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('advWeb-angular');
}
