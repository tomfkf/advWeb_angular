import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MobilePostService } from '../services/mobile-post';
import { TimeFormat } from '../../shared/constants/regex';
import { MobilePostQueryResult } from '../models/mobile-post-query-result';
import { MobilePost } from '../models/mobile-post';
import { MobilePostResult } from '../mobile-post-result/mobile-post-result';
import { MobilePostQueryRequest } from '../models/mobile-post-query-request';
import { CommonModule, AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-mobile-post-search',
  imports: [ReactiveFormsModule, CommonModule, FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    TranslatePipe, MatExpansionModule],
  templateUrl: './mobile-post-search.html',
  styleUrl: './mobile-post-search.css',
})
export class MobilePostSearch {
  form: FormGroup;
  initMobilePostOption: MobilePost[];
  @Output() queryFilter = new EventEmitter<MobilePostQueryRequest>();
  openAdvancedSearch = false;
  advQueryKey: { field: keyof MobilePost; type: string }[] = [
    { "field": "id" as keyof MobilePost, type: "array" },

    { "field": "mobileCode" as keyof MobilePost, type: "array" },
    { "field": "location" as keyof MobilePost, type: "text" },
    { "field": "address" as keyof MobilePost, type: "text" },
    { "field": "name" as keyof MobilePost, type: "text" },
    { "field": "district" as keyof MobilePost, type: "text" },
    { "field": "seq" as keyof MobilePost, type: "array" },
    { "field": "dayOfWeekCode" as keyof MobilePost, type: "array" },
    { "field": "latitude" as keyof MobilePost, type: "number" },
    { "field": "longitude" as keyof MobilePost, type: "number" },
    { "field": "closeHour" as keyof MobilePost, type: "timeRange" },
    { "field": "openHour", type: "timeRange" }
  ];

  constructor(fb: FormBuilder, service: MobilePostService) {
    this.form = fb.group({
      keyword: ['', [Validators.maxLength(255)]],
      mobileCode: [[], [Validators.maxLength(3)]],
      name: ['', [Validators.maxLength(50)]],
      district: ['', [Validators.maxLength(50)]],
      location: ['', [Validators.maxLength(100)]],
      address: ['', [Validators.maxLength(255)]],
      seq: [[], [Validators.max(100), Validators.min(1)]],
      dayOfWeekCode: [[], [Validators.max(5), Validators.min(1)]],
      latitude: [null, [Validators.max(90), Validators.min(-90)]],
      longitude: [null, [Validators.max(180), Validators.min(-180)]],
      closeHourStart: ['', [Validators.pattern(TimeFormat)]],
      closeHourEnd: ['', [Validators.pattern(TimeFormat)]],
      openHourStart: ['', [Validators.pattern(TimeFormat)]],
      openHourEnd: ['', [Validators.pattern(TimeFormat)]],
      id: [[]]
    });

    this.initMobilePostOption = [];
    service.getAllRecords().subscribe((data: MobilePostQueryResult) => {
      // this.queryResult = data;
      this.initMobilePostOption = data.items || [];
    });
  }

  onSubmit() {
    console.log("aaa");
    this.queryFilter.emit({ ...this.form.value });
  }

  switchAdvSearch() {
    this.openAdvancedSearch = !this.openAdvancedSearch;
    console.log(this.openAdvancedSearch);
  }


  getUniqueOptions(field: string): any[] {
    let keyField = field as keyof MobilePost;
    const values = this.initMobilePostOption.map(opt => opt[keyField]);
    return [...new Set(values)];
  }

  updateArrayValue(field: string, value: any, event: any) {
    if (event.target.checked) {
      this.form.controls[field].value.push(value);
    } else {
      this.form.controls[field].value.splice(this.form.controls[field].value.indexOf(value), 1);
    }
  }

}
