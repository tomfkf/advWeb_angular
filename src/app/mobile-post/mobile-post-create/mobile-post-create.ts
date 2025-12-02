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
import { MatStepperModule } from '@angular/material/stepper';

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
    MatIconModule, MatStepperModule
  ],
  templateUrl: './mobile-post-create.html',
  styleUrl: './mobile-post-create.css',
})
export class MobilePostCreate {
  filteredOptions: { [key: string]: Observable<Set<string>> } = {};
  initMobilePostOption: MobilePost[];
  // key = Object.keys(new MobilePost());
  action: MobilePostAction;
  disabledField: string[] = [];
  hiddenField: string[] = [];
  actionString: string;
  id: number;

  locationForm: FormGroup;
  basicInfoForm: FormGroup;

  key = {
    "basicInfo": [
      { field: 'id', type: 'number', validators: [] },
      {
        field: 'mobileCode',
        type: 'string',
        validators: [Validators.maxLength(3)]

      }, {
        field: 'seq',
        type: 'number',
        validators: [Validators.max(100), Validators.min(1)]
      }, {
        field: 'dayOfWeekCode',
        type: 'number',
        validators: [Validators.max(5), Validators.min(1)]
      }, {
        field: 'nameEN',
        type: 'string',
        validators: [Validators.maxLength(50)]

      }, {
        field: 'nameTC',
        type: 'string',
        validators: [Validators.maxLength(50)]
      }, {
        field: 'nameSC',
        type: 'string',
        validators: [Validators.maxLength(50)]
      }, {
        field: 'openHour',
        type: 'time',
        validators: [Validators.pattern(TimeFormat)]
      }, {
        field: 'closeHour',
        type: 'time',
        validators: [Validators.pattern(TimeFormat)]
      }],
    "location": [{
      field: 'locationTC',
      type: 'string',
      validators: [Validators.maxLength(100)]
    }, {
      field: 'locationSC',
      type: 'string',
      validators: [Validators.maxLength(100)]

    }, {
      field: 'locationEN',
      type: 'string',
      validators: [Validators.maxLength(100)]
    }, {
      field: 'districtEN',
      type: 'string',
      validators: [Validators.maxLength(50)]
    }, {
      field: 'districtTC',
      type: 'string',
      validators: [Validators.maxLength(50)]
    }, {
      field: 'districtSC',
      type: 'string',
      validators: [Validators.maxLength(50)]
    }, {
      field: 'addressEN',
      type: 'string',
      validators: [Validators.maxLength(255)]
    }, {
      field: 'addressTC',
      type: 'string',
      validators: [Validators.maxLength(255)]
    }, {
      field: 'addressSC',
      type: 'string',
      validators: [Validators.maxLength(255)]
    }, {
      field: 'latitude',
      type: 'number',
      validators: [Validators.max(90), Validators.min(-90)]
    }, {
      field: 'longitude',
      type: 'number',
      validators: [Validators.max(180), Validators.min(-180)]
    }
    ]
  }
  basicFormKey = this.key.basicInfo.map(f => f.field);
  locationFormKey = this.key.location.map(f => f.field);

  constructor(
    private fb: FormBuilder,
    private service: MobilePostService,
    @Inject(MAT_DIALOG_DATA) data: { action: MobilePostAction; id?: string }
  ) {


    this.basicInfoForm = this.createGroup(this.key.basicInfo);

    this.locationForm = this.createGroup(this.key.location);


    this.id = Number(data.id);

    this.action = data.action;
    this.actionString = MobilePostAction[this.action].toUpperCase();
    switch (this.action) {
      case MobilePostAction.delete:
        this.disabledField = [
          ...this.key.basicInfo.map(f => f.field),
          ...this.key.location.map(f => f.field)
        ];
        break;
      case MobilePostAction.edit:
        this.disabledField = ['id'];
        break;
      case MobilePostAction.create: ``
        this.disabledField = [];
        this.hiddenField = ['id'];
        break;
    }
    for (const key of [...this.key.basicInfo.map(f => f.field), ...this.key.location.map(f => f.field)]) {
      if (this.disabledField.includes(key)) {
        this.basicInfoForm.get(key)?.disable();
        this.locationForm.get(key)?.disable();
      }
    }

    if (data.id) {
      service.getRecordById(Number(data.id)).subscribe((data: MobilePostQueryResult) => {
        const initMobilePost = data.items ? data.items[0] : undefined;
        if (initMobilePost) {
          for (const basicFormField of this.key.basicInfo) {
            this.basicInfoForm.patchValue({
              [basicFormField.field]: initMobilePost[basicFormField.field as keyof MobilePost]
            });
          }
          for (const locationFormField of this.key.location) {
            this.locationForm.patchValue({
              [locationFormField.field]: initMobilePost[locationFormField.field as keyof MobilePost]
            });
          }
        }
      });
    }

    const defaultValidators = [Validators.required];


    this.initMobilePostOption = [];
    service.getAllRecords().subscribe((data: MobilePostQueryResult) => {
      this.initMobilePostOption = data.items || [];
    });
  }


  createGroup(fields: any[]): FormGroup {
    const group: any = {};
    fields.forEach(f => {
      group[f.field] = new FormControl('', f.validators || []);
    });
    return this.fb.group(group);
  }

  setUpDefaultValidatorsAndFilterOption(formGroup: FormGroup) {
    const defaultValidators = [Validators.required];
    Object.keys(formGroup.controls).forEach((key) => {
      if (key === 'id') {
        return;
      }
      const control = formGroup.get(key);
      if (control) {
        const existingValidators = control.validator ? [control.validator] : [];
        control.setValidators([...defaultValidators, ...existingValidators]);
        control.updateValueAndValidity();
        this.filteredOptions[key] = this.createFilterOption(key as keyof MobilePost, formGroup);
      }
    });

  }


  private createFilterOption(field: keyof MobilePost, formGroup: FormGroup): Observable<Set<string>> {
    return formGroup.get(field)!.valueChanges.pipe(
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

    const formData = {
      ...this.basicInfoForm.value,
      ...this.locationForm.value
    }

    switch (this.action) {
      case MobilePostAction.create:
        if (this.basicInfoForm.valid && this.locationForm.valid) {
          console.log('Creating Mobile Post:', formData);
        }
        this.service.createRecord(formData as MobilePost);
        break;
      case MobilePostAction.edit:
        if (this.basicInfoForm.valid && this.locationForm.valid) {
          this.service.updateRecord(formData as MobilePost, this.id);
        }
        break;
      case MobilePostAction.delete:
        this.service.deleteRecordById(this.id);
        break;
    }
  }

  close() { }

}
