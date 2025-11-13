import { AbstractControl, ValidationErrors } from '@angular/forms';

export function numberArrayValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!Array.isArray(value)) {
    return { notArray: true };
  }
  
  const allNumbers = value.every(v => typeof v === 'number' && !isNaN(v));
  if (!allNumbers) {
    return { notNumberArray: true };
  }

  if (value.length > 3) {
    return { maxLengthArray: true };
  }

  return null; 
}