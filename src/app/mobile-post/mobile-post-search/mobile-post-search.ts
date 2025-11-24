import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
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
import { MatIconModule } from '@angular/material/icon';
import { map, Observable, startWith } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MobilePostAction } from '../models/mobile-post-action-enum';

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
    MatExpansionModule, MatCheckboxModule, MatCardModule, MatButtonModule, MatDividerModule, MatIconModule, MatChipsModule
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
    { field: 'mobileCode', type: 'array' },
    { field: 'location', type: 'array' },
    { field: 'name', type: 'array' },
    { field: 'district', type: 'array' },
    { field: 'address', type: 'text' },
    { field: 'seq', type: 'array' },
    { field: 'dayOfWeekCode', type: 'array' },
    // { "field": "latitude" , type: "number" },
    // { "field": "longitude" , type: "number" },
    { field: 'closeHour', type: 'timeRange' },
    { field: 'openHour', type: 'timeRange' },
  ];

  filteredOptions: { [key: string]: Observable<string[]> } = {};
  currentLanguage = 'EN';
  expandedFields: { [field: string]: boolean } = {};
  @Output() mobilePostEvent = new EventEmitter<{ action: MobilePostAction, id?: string }>(); 

  @ViewChild('advSearchContainer') advSearchContainer!: ElementRef;
  @ViewChild('advSearchButton') advSearchButton!: ElementRef;
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
    this.filteredOptions['keyword'] = this.createFilterOption('keyword');

  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.openAdvancedSearch && !this.advSearchContainer.nativeElement.contains(event.target) && !this.advSearchButton.nativeElement.contains(event.target)) {
      this.openAdvancedSearch = false;
    }
  }
  onSubmit() {
    this.queryFilter.emit({ ...this.form.value });
  }

  switchAdvSearch() {
    this.openAdvancedSearch = !this.openAdvancedSearch;
    console.log(this.openAdvancedSearch);
  }

  getUniqueOptions(field: string, expend: boolean): { overLimit: boolean, option: any[] } {
    const keyField = field as keyof MobilePost;
    const keyLangField = field + this.currentLanguage as keyof MobilePost;

    const values = this.initMobilePostOption.map((opt) => opt[keyField] || opt[keyLangField]).filter(v => v !== undefined && v !== null).map(v => String(v));
    let result = [...new Set(values)];
    let wordCounter = 0;
    const limitCount = 200;

    const filteredResult = result.filter((word) => {
      wordCounter += word.length;
      return wordCounter <= limitCount;
    });

    let returnResult: (string | number)[] = expend ? result : filteredResult;
    returnResult = returnResult.map((word) => {
      const number = Number(word);
      return isNaN(number) ? word : number;
    }).sort((a, b) => {
      if (typeof a === "number" && typeof b === "number") return a - b;
      if (typeof a === "string" && typeof b === "string") return a.localeCompare(b);
      return typeof a === "number" ? -1 : 1;
    });

    return { overLimit: wordCounter > limitCount, option: returnResult };
  }

  updateArrayValue(field: string, value: any, event: any) {
    const currentValue = this.form.controls[field].value || [];
    if (event.checked) {
      this.form.controls[field].setValue([...currentValue, value]);
    } else {
      this.form.controls[field].setValue(currentValue.filter((v: any) => v !== value));
    }
  }

  private createFilterOption(field: string): Observable<string[]> {
    return this.form.get(field)!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '', field))
    );
  }

  private _filter(value: string, field: string): string[] {
    console.log("filtering", value, field);
    const keyField = field as keyof MobilePost;
    const keyLangField = field + this.currentLanguage as keyof MobilePost;
    let result: Set<string> = new Set<string>();
    if (field === 'keyword') {
      const keywordField = ['locationTC', 'locationSC', 'locationEN', 'addressTC', 'addressSC', 'addressEN', 'nameTC', 'nameSC', 'nameEN', 'districtTC', 'districtSC', 'districtEN']
      for (let mobilePost of this.initMobilePostOption) {
        for (let kField of keywordField) {
          const fieldValue = String(mobilePost[kField as keyof MobilePost]);
          if (fieldValue && fieldValue.toLowerCase().includes(value.toLowerCase())) {
            result.add(fieldValue);
          }
        }
      }
    } else {
      result = new Set(
        this.initMobilePostOption
          .map((post) => String(post[keyField] ?? post[keyLangField] ?? ''))
          .filter((option) => option.toLowerCase().includes(value.toLowerCase()))
      );
    }

    return Array.from(result).sort();
  }

  removeValue(keys: string | string[]) {
    console.log("remove keys", keys);
    let removeKeys: string[] = [];
    if (Array.isArray(keys)) {
      removeKeys = keys;
    } else {
      removeKeys = [keys];
    }
    for (let key of removeKeys) {
      let value = this.form.controls[key].value;

      if (Array.isArray(value)) {
        this.form.controls[key].setValue([]);
      } else {
        this.form.controls[key].setValue('');
      }
    }


  }

  removeAllValue() {
    this.removeValue(this.advQueryKey.map(k => k.field).concat(['keyword']));
  }
  toggleExpand(field: string) {
    this.expandedFields[field] = !this.expandedFields[field];
  }
    createMobilePostDialog() {
      this.mobilePostEvent.emit({ action : MobilePostAction.create});
    }
}
