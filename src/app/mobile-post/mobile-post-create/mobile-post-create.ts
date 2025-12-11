import { AfterViewInit, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TimeFormat } from '../../shared/constants/regex';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, min, startWith } from 'rxjs/operators';
import { TranslatePipe } from '@ngx-translate/core';
import { MobilePostService } from '../services/mobile-post';
import { MobilePostQueryResult } from '../models/mobile-post-query-result';
import { MobilePost } from '../models/mobile-post';
import { MobilePostResult } from '../mobile-post-result/mobile-post-result';
import { MobilePostAction } from '../models/mobile-post-action-enum';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import * as chineseConv from 'chinese-conv';
import { MatChipRemove } from "@angular/material/chips";

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
    MatIconModule, MatStepperModule,
    MatChipRemove
],
  templateUrl: './mobile-post-create.html',
  styleUrl: './mobile-post-create.css',
})
export class MobilePostCreate implements AfterViewInit {
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
  map!: L.Map;
  L!: any;
  inputPost?: MobilePost;
  displayMapFlag: boolean = false;
  selectedMarker?: any;

  key = {
    "basicInfo": [
      { field: 'id', type: 'number', validators: [] },
      {
        field: 'mobileCode',
        type: 'text',
        validators: [Validators.maxLength(3)]

      }, {
        field: 'seq',
        type: 'number',
        validators: [Validators.max(100), Validators.min(1)],
        max: 100,
        min: 1
      }, {
        field: 'dayOfWeekCode',
        type: 'number',
        validators: [Validators.max(5), Validators.min(1)],
        max: 5,
        min: 1
      }, {
        field: 'nameEN',
        type: 'text',
        validators: [Validators.maxLength(50)]

      }, {
        field: 'nameTC',
        type: 'text',
        validators: [Validators.maxLength(50)]
      }, {
        field: 'nameSC',
        type: 'text',
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
      type: 'text',
      validators: [Validators.maxLength(100)]
    }, {
      field: 'locationSC',
      type: 'text',
      validators: [Validators.maxLength(100)]

    }, {
      field: 'locationEN',
      type: 'text',
      validators: [Validators.maxLength(100)]
    }, {
      field: 'districtEN',
      type: 'text',
      validators: [Validators.maxLength(50)]
    }, {
      field: 'districtTC',
      type: 'text',
      validators: [Validators.maxLength(50)]
    }, {
      field: 'districtSC',
      type: 'text',
      validators: [Validators.maxLength(50)]
    }, {
      field: 'addressEN',
      type: 'text',
      validators: [Validators.maxLength(255)]
    }, {
      field: 'addressTC',
      type: 'text',
      validators: [Validators.maxLength(255)]
    }, {
      field: 'addressSC',
      type: 'text',
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
  @ViewChild('stepper') stepper!: MatStepper;

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
      case MobilePostAction.create:
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
        this.inputPost = data.items ? data.items[0] : undefined;
        this.setUpWithInputPost();
      });
    }

    const defaultValidators = [Validators.required];
    this.setUpDefaultValidatorsAndFilterOption(this.basicInfoForm);
    this.setUpDefaultValidatorsAndFilterOption(this.locationForm);

    this.initMobilePostOption = [];
    service.getAllRecords().subscribe((data: MobilePostQueryResult) => {
      this.initMobilePostOption = data.items || [];
    });
  }

  async ngAfterViewInit() {
    this.L = await import('leaflet');

    if (this.inputPost) {
      const lat = this.inputPost.latitude || 22.3193;
      const lng = this.inputPost.longitude || 114.1694;
      this.map = this.L.map('map').setView([lat, lng], 13);
      const inputMarker = this.L.marker([lat, lng]).addTo(this.map);
      inputMarker.bindPopup('Current Location').openPopup();

    } else {
      this.map = this.L.map('map').setView([22.3193, 114.1694], 13);
    }

    this.map.on('click', (e) => {
      if (confirm('Set location here?')) {
        if (this.selectedMarker) {
          this.map.removeLayer(this.selectedMarker);
        }
        this.selectedMarker = this.L.marker(e.latlng).addTo(this.map);
        this.selectedMarker.bindPopup('Selected Location').openPopup();
        this.locationForm.patchValue({
          latitude: e.latlng.lat,
          longitude: e.latlng.lng
        });

        this.service.getLocationByLatLngWithLanguage(e.latlng.lat, e.latlng.lng, 'zh-HK').subscribe((result) => {
          if (result && result.address) {
            console.log('TC Result:', result);
            this.locationForm.patchValue({
              addressTC: result.address.road || '',
              districtTC: result.address.city || '',
              locationTC: result.address.suburb || '',
              addressSC: chineseConv.sify(result.address.road || '') || '',
              districtSC: chineseConv.sify(result.address.city || '') || '',
              locationSC: chineseConv.sify(result.address.suburb || '') || '',
            });
          }
        });
        this.service.getLocationByLatLngWithLanguage(e.latlng.lat, e.latlng.lng, 'en').subscribe((result) => {
          if (result && result.address) {
            console.log('EN Result:', result);
            this.locationForm.patchValue({
              addressEN: result.address.road || '',
              districtEN: result.address.city || '',
              locationEN: result.address.suburb || '',
            });
          }
        });



      }

    });

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    if (this.initMobilePostOption) {
      this.initMobilePostOption.forEach((post) => {
        const marker = this.L.marker([post.latitude, post.longitude]).addTo(this.map);
        if (this.inputPost && post.id === this.inputPost.id) {
          marker.bindPopup(`<b>Current<br/> ${post.nameEN} ${post.openHour} - ${post.closeHour}</b><br/>${post.addressEN}`).openPopup();
        } else {
          marker.bindPopup(`<b>${post.nameEN} ${post.openHour} - ${post.closeHour}</b><br/>${post.addressEN}`);

        }
      });
    }
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
  toggleMap() {
    this.displayMapFlag = !this.displayMapFlag;
  }

  reset() {
    this.stepper.reset();
    this.setUpWithInputPost();
  }

  setUpWithInputPost() {
    if (this.inputPost) {
      for (const basicFormField of this.key.basicInfo) {
        this.basicInfoForm.patchValue({
          [basicFormField.field]: this.inputPost[basicFormField.field as keyof MobilePost]
        });
      }
      for (const locationFormField of this.key.location) {
        this.locationForm.patchValue({
          [locationFormField.field]: this.inputPost[locationFormField.field as keyof MobilePost]
        });
      }
    }
  }

  getChangedKeys(): string[] {
    let result:string[] = [];

    
    if (this.inputPost) {
      for (const key of [...this.basicFormKey, ...this.locationFormKey]) {
        const value = this.getFormValueByKey(key);
        const initValue = this.inputPost[key as keyof MobilePost];
        if (value !== initValue) {
          result.push(key); 
        }
      }
    }else {
      result = [...this.basicFormKey, ...this.locationFormKey];
    }

    return result;
  }

  getFormValueByKey(key: string): any { 
    console.log('Getting value for key:', key);
    return '';
    // return this.basicInfoForm.get(key)?.value || this.locationForm.get(key)?.value;
  }
}
