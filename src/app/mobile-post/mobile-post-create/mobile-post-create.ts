import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MobilePost } from '../models/mobile-post';
import { plainToInstance } from 'class-transformer';
import { CommonModule } from '@angular/common';
import { getValidators } from '../../shared/decorators/validator.decorator';


@Component({
  selector: 'app-mobile-post-create',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './mobile-post-create.html',
  styleUrl: './mobile-post-create.css',
})
export class MobilePostCreate {
  form: FormGroup;
  keys = Object.keys(new MobilePost());

  constructor(fb: FormBuilder) {
    console.log(this.keys);
    this.form = fb.group({
      
    }); 
    for (const key of this.keys) {
      this.form.addControl(key, new FormControl('', getValidators(MobilePost.prototype, key) as ValidatorFn[]));
    }
  }
  // classValidator(control: FormControl): { [s: string]: boolean } | null {
  //   const instance = plainToInstance(MobilePost, { mobileCode: control.value });
  //   console.log(control);
  //   const response = {};
  //   return response;
  // }
}
