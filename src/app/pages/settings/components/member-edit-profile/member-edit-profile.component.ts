import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { User } from '@core/models';

import * as fromSettings from '@settings/store/reducers';
import { SettingsActions } from '@settings/store/actions';

@Component({
  selector: 'app-member-edit-profile',
  templateUrl: './member-edit-profile.component.html',
  styleUrls: [ './member-edit-profile.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberEditProfileComponent implements OnInit, OnDestroy {

  form: FormGroup = this.fb.group({
    knownAs: [ '', Validators.required ],
    city: '',
    country: '',
    interests: '',
    introduction: ''
  });

  details?: User = undefined;

  formChanged$ = new BehaviorSubject(false);
  savingChanges$: Observable<boolean> = this.store.select(fromSettings.selectUserDetailsSavingChanges);

  private destroy$ = new Subject<boolean>();

  constructor(private store: Store<fromSettings.State>, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.handleFormChanges();
    this.updateFormData();
  }

  handleFormChanges(): void {
    this.form.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => { this.formChanged$.next(this.form.dirty); });
  }

  updateFormData(): void {
    this.store.select(fromSettings.selectUserDetails)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.details = data;
        if (data !== null) {
          this.patchForm(data);
        }
      });
  }

  onChipChange(): void {
    this.formChanged$.next(true);
  }

  onSubmit() {
    if (this.form.valid && this.formChanged$.value) {
      const interests = this.joinInterests(this.form.get('interests')?.value);
      const user = { ...this.details, ...this.form.value, interests };
      this.store.dispatch(SettingsActions.editAuthDetails({ user }));
      this.formChanged$.next(false);
    }
  }

  private patchForm(user: User) {
    this.form.reset();

    const interests: string[] = user?.interests?.split(/[\s,]+/) ?? [];

    this.form.patchValue({
      ...user,
      interests,
    });
  }

  private joinInterests(interests: any[]) {
    console.log(interests);
    const newArray: string[] = [];
    for (const interest of interests) {
      if (newArray.includes(interest)) {
        continue;
      }
      if (typeof interest === 'string') {
        newArray.push(interest);
      } else if (typeof interest === 'object') {
        newArray.push(interest.value);
      }
    }
    return newArray.join(',');
  }

  required(control: string): boolean {
    return (this.form.get(control)?.touched && this.form.get(control)?.invalid) ?? false;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

}
