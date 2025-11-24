import { Component, Inject, Input, OnInit } from '@angular/core';
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
import { MobilePostAction } from '../models/mobile-post-action-enum';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-mobile-post-create',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    TranslatePipe,
    MatIconModule,
  ],
  templateUrl: './mobile-post-create.html',
  styleUrl: './mobile-post-create.css',
})
export class MobilePostCreate {
  form: FormGroup;
  filteredOptions: { [key: string]: Observable<Set<string>> } = {};
  initMobilePostOption: MobilePost[];
  key = Object.keys(new MobilePost());
  action: MobilePostAction;
  disabledField: string[] = [];
  hiddenField: string[] = [];
  actionString: string;
  id: number;
  constructor(
    fb: FormBuilder,
    private service: MobilePostService,
    @Inject(MAT_DIALOG_DATA) data: { action: MobilePostAction; id?: string }
  ) {
    this.form = fb.group({
      id: [null],
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

    this.id = Number(data.id);

    this.action = data.action;
    this.actionString = MobilePostAction[this.action].toUpperCase();
    switch (this.action) {
      case MobilePostAction.delete:
        this.disabledField = this.key;
        break;
      case MobilePostAction.edit:
        this.disabledField = ['id'];
        break;
      case MobilePostAction.create:
        this.disabledField = [];
        this.hiddenField = ['id'];
        break;
    }
    for (const key of this.key) {
      if (this.disabledField.includes(key)) {
        this.form.get(key)?.disable();
      }
    }
    if (data.id) {
      service.getRecordById(Number(data.id)).subscribe((data: MobilePostQueryResult) => {
        const initMobilePost = data.items ? data.items[0] : undefined;
        if (initMobilePost) {
          this.form.patchValue({
            id: initMobilePost.id || null,
            mobileCode: initMobilePost.mobileCode || '',
            locationTC: initMobilePost.locationTC || '',
            locationSC: initMobilePost.locationSC || '',
            addressTC: initMobilePost.addressTC || '',
            nameSC: initMobilePost.nameSC || '',
            districtSC: initMobilePost.districtSC || '',
            addressSC: initMobilePost.addressSC || '',
            nameTC: initMobilePost.nameTC || '',
            districtTC: initMobilePost.districtTC || '',
            nameEN: initMobilePost.nameEN || '',
            districtEN: initMobilePost.districtEN || '',
            locationEN: initMobilePost.locationEN || '',
            addressEN: initMobilePost.addressEN || '',
            seq: initMobilePost.seq || null,
            dayOfWeekCode: initMobilePost.dayOfWeekCode || null,
            latitude: initMobilePost.latitude || null,
            longitude: initMobilePost.longitude || null,
            closeHour: initMobilePost.closeHour || '',
            openHour: initMobilePost.openHour || '',
          });
        }
      });
    }

    const defaultValidators = [Validators.required];

    Object.keys(this.form.controls).forEach((key) => {
      if (key === 'id') {
        return;
      }
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
      this.initMobilePostOption = data.items || [];
    });
  }

  private createFilterOption(field: keyof MobilePost): Observable<Set<string>> {
    return this.form.get(field)!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '', field))
    );
  }

  private _filter(value: string, field: keyof MobilePost): Set<string> {
    const filterValue = value.toLowerCase();
    return new Set(
      this.initMobilePostOption
        .map((post) => String(post[field] ?? ''))
        .filter((option) => option.toLowerCase().includes(filterValue))
    );
  }

  onSubmit() {
    console.log('Form Data Submitted:', this.form.valid);

    const formData = this.form.value;

    switch (this.action) {
      case MobilePostAction.create:
        if (this.form.valid) {
          console.log('Creating Mobile Post:', formData);
        }
        break;
      case MobilePostAction.edit:
        if (this.form.valid) {
          this.service.updateRecord(formData as MobilePost, this.id);
        }
        break;
      case MobilePostAction.delete:
        this.service.deleteRecordById(this.id);
        break;
    }
  }
  close() {}
  check() {
    for (const key in this.form.controls) {
      const control = this.form.get(key);
      if (control && control.invalid) {
        console.log(`${key} is invalid`, control.errors);
      }
    }
  }
}
