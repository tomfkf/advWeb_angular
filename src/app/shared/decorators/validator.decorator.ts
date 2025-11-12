import 'reflect-metadata';
import { Validators, ValidatorFn } from '@angular/forms';

const VALIDATOR_METADATA_KEY = 'VALIDATOR_METADATA_KEY';

export function FormGroupValidate(...validators: ValidatorFn[]) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata(VALIDATOR_METADATA_KEY, validators, target, propertyKey);
  };
}

export function getValidators(target: any, propertyKey: string): ValidatorFn[] {
  return Reflect.getMetadata(VALIDATOR_METADATA_KEY, target, propertyKey) || [];
}
