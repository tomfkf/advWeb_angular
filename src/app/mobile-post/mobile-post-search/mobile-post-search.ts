import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MobilePostService } from '../services/mobile-post';
import { TimeFormat } from '../../shared/constants/regex';

@Component({
  selector: 'app-mobile-post-search',
  imports: [],
  templateUrl: './mobile-post-search.html',
  styleUrl: './mobile-post-search.css',
})
export class MobilePostSearch {
  form: FormGroup;
  constructor(fb: FormBuilder, service: MobilePostService) {
    this.form = fb.group({
      mobileCode: ['', [Validators.maxLength(3)]],
      name: ['', [Validators.maxLength(50)]],
      district: ['', [Validators.maxLength(50)]],
      location: ['', [Validators.maxLength(100)]],
      address: ['', [Validators.maxLength(255)]],
      seq: [null, [Validators.max(100), Validators.min(1)]],
      dayOfWeekCode: [null, [Validators.max(5), Validators.min(1)]],
      latitude: [null, [Validators.max(90), Validators.min(-90)]],
      longitude: [null, [Validators.max(180), Validators.min(-180)]],
      closeHour: ['', [Validators.pattern(TimeFormat)]],
      openHour: ['', [Validators.pattern(TimeFormat)]],
      id :['']
    });
  }
  
}
