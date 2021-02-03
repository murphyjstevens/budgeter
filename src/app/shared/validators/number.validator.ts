import { AbstractControl } from '@angular/forms';

export function NumberValidator(control: AbstractControl): any {
  return control.value ? null : { numberInvalid: true };
}
