import { AbstractControl } from '@angular/forms';

export function NumberValidator(control: AbstractControl) {
  return control.value ? null : { numberInvalid: true };
}