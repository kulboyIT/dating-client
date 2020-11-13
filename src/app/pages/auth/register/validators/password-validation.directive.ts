import { FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passwordValidation: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  const error = { 'passwordsDontMatch': true };

  if (password === null || confirmPassword === null) {
    return error
  }

  if (password === confirmPassword) {
    return null;
  }
  return error;
};

