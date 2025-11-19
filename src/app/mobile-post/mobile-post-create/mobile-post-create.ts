import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TimeFormat } from '../../shared/constants/regex';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TranslatePipe } from '@ngx-translate/core';
import { MobilePostService } from '../services/mobile-post';
import { MobilePostQueryResult } from '../models/mobile-post-query-result';
import { MobilePost } from '../models/mobile-post';
import { MobilePostResult } from '../mobile-post-result/mobile-post-result';


@Component({
  selector: 'app-mobile-post-create',
  imports: [ReactiveFormsModule, CommonModule, FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe, TranslatePipe],
  templateUrl: './mobile-post-create.html',
  styleUrl: './mobile-post-create.css',
})


export class MobilePostCreate {
  form: FormGroup;
  @Input() isCreation = true;
  filteredOptions: { [key: string]: Observable<Set<string>> } = {};
  initMobilePostOption: MobilePost[];
  test : MobilePostQueryResult = {};


  constructor(fb: FormBuilder, service: MobilePostService) {
    const defaultValidators = this.isCreation ? [Validators.required] : [];
    this.form = fb.group({
      mobileCode: ['', [Validators.maxLength(3)]],
      locationTC: ['', [Validators.maxLength(100)]],
      locationSC: ['', [Validators.maxLength(100)]],
      addressTC: ['', [Validators.maxLength(255)]],
      nameSC: ['', [Validators.maxLength(50)]],
      districtSC: ['', [Validators.maxLength(50)]],
      addressSC: ['', [Validators.maxLength(255)]],
      nameTC: ['', [Validators.maxLength(50)]],
      districtTC: ['', [Validators.maxLength(50)]],
      nameEN: ['', [Validators.maxLength(50)]],
      districtEN: ['', [Validators.maxLength(50)]],
      locationEN: ['Sham Tseng', [Validators.maxLength(100)]],
      addressEN: ['', [Validators.maxLength(255)]],
      seq: [null, [Validators.max(100), Validators.min(1)]],
      dayOfWeekCode: [null, [Validators.max(5), Validators.min(1)]],
      latitude: [null, [Validators.max(90), Validators.min(-90)]],
      longitude: [null, [Validators.max(180), Validators.min(-180)]],
      closeHour: ['', [Validators.pattern(TimeFormat)]],
      openHour: ['', [Validators.pattern(TimeFormat)]],
    });


    Object.keys(this.form.controls).forEach(key => {

      const control = this.form.get(key);
      if (control) {
        const existingValidators = control.validator ? [control.validator] : [];
        control.setValidators([...defaultValidators, ...existingValidators]);
        control.updateValueAndValidity();
        this.filteredOptions[key] = this.createFilterOption(key as keyof MobilePost);
      }
    });

    this.initMobilePostOption = [];
    service.getAllRecords().subscribe((data: MobilePostQueryResult) => {
      this.test = data;
      this.initMobilePostOption = data.items || [];
    });

  }

  private createFilterOption(field: keyof MobilePost): Observable<Set<string>> {
    return this.form.get(field)!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '', field))
    );
  }

  private _filter(value: string, field: keyof MobilePost): Set<string> {
    const filterValue = value.toLowerCase();
    return new Set(this.initMobilePostOption
      .map(post => String(post[field] ?? ''))
      .filter(option => option.toLowerCase().includes(filterValue)))
      ;
  }


}
