import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MobilePost } from '../models/mobile-post';
import { plainToInstance } from 'class-transformer';
import { JsonPipe } from '@angular/common';


@Component({
  selector: 'app-mobile-post-create',
  imports: [ReactiveFormsModule],
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
        this.form.addControl(key, fb.control(''));
    }
  }
  studentIdValidator(control: FormControl): { [s: string]: boolean } | null {
    // const instance = plainToInstance(MobilePost, { [control]: control.value });
    const jsonPipe = new JsonPipe();
    console.log(jsonPipe.transform(control));
    const response = {};
    return response;
  }
}
