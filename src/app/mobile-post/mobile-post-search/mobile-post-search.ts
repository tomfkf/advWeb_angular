import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { MatIcon } from '@angular/material/icon';
import { map, Observable, startWith } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-mobile-post-search',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    TranslatePipe,
    MatExpansionModule,MatCheckboxModule,MatCardModule
  ],
  templateUrl: './mobile-post-search.html',
  styleUrl: './mobile-post-search.css',
})
export class MobilePostSearch {
  form: FormGroup;
  initMobilePostOption: MobilePost[];
  @Output() queryFilter = new EventEmitter<MobilePostQueryRequest>();
  openAdvancedSearch = false;
  advQueryKey: { field: string; type: string }[] = [
    // { field: 'id' , type: 'array' },

    { field: 'mobileCode' , type: 'array' },
    { field: 'location' , type: 'text' },
    { field: 'address' , type: 'text' },
    { field: 'name' , type: 'text' },
    { field: 'district' , type: 'text' },
    { field: 'seq' , type: 'array' },
    { field: 'dayOfWeekCode' , type: 'array' },
    // { "field": "latitude" , type: "number" },
    // { "field": "longitude" , type: "number" },
    { field: 'closeHour' , type: 'timeRange' },
    { field: 'openHour', type: 'timeRange' },
  ];

  filteredOptions: { [key: string]: Observable<Set<string>> } = {};

  constructor(fb: FormBuilder, service: MobilePostService, private eRef: ElementRef) {
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
      id: [[]],
    });

    this.initMobilePostOption = [];
    service.getAllRecords().subscribe((data: MobilePostQueryResult) => {
      // this.queryResult = data;
      this.initMobilePostOption = data.items || [];
    });
    for (let key of this.advQueryKey) {
      if (key.type === 'text') {
        this.filteredOptions[key.field] = this.createFilterOption(key.field);
      }
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.openAdvancedSearch && !this.eRef.nativeElement.contains(event.target)) {
      this.openAdvancedSearch = false;
    }
  }
  onSubmit() {
    console.log('aaa');
    this.queryFilter.emit({ ...this.form.value });
  }

  switchAdvSearch() {
    this.openAdvancedSearch = !this.openAdvancedSearch;
    console.log(this.openAdvancedSearch);
  }

  getUniqueOptions(field: string): any[] {
    let keyField = field as keyof MobilePost;
    const values = this.initMobilePostOption.map((opt) => opt[keyField]);
    return [...new Set(values)];
  }

  updateArrayValue(field: string, value: any, event: any) {
    console.log("bbb",event)
    if (event.checked) {
      this.form.controls[field].value.push(value);
    } else {
      this.form.controls[field].value.splice(this.form.controls[field].value.indexOf(value), 1);
    }
  }

  private createFilterOption(field: string): Observable<Set<string>> {
    return this.form.get(field)!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '', field))
    );
  }

  private _filter(value: string, field: string): Set<string> {
    return new Set();
    // const filterValue = value.toLowerCase();
    // const fields = [field+'EN' as keyof MobilePost, field+'TC' as keyof MobilePost, field+'SC' as keyof MobilePost];
    // return new Set(
    //   this.initMobilePostOption
    //     .map((post) => String(post[fields[0]] ?? ''))
    //     .filter((option) => option.toLowerCase().includes(filterValue))
    // );
  }
}
