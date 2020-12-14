import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { ProfileForm } from '../models/settings.model'

@Component({
  selector: 'app-profile',
  // active for avatar
  // encapsulation: ViewEncapsulation.None,
  // styleUrls: ['./profile.component.scss'],
  template: `
    <app-form
      [formGroup]="profileForm"
      [title]="title"
      [subtitle]="subtitle"
      [data]="data"
      (resetForm)="onReset()"
      (submitForm)="onSubmit($event)"
    >
      <!-- TODO : Add avatar logo  -->
      <!-- <div class="flex flex-col gt-xs:flex-row">
        <div class="flex-1 gt-xs:pr-2">
          <img *ngIf="data.avatar" [src]="data.avatar" #avatar class="h-32 w-32" />
          <div class="no-avatar" *ngIf="!data.avatar">{{ data.firstName.charAt(0) }} {{ data.lastName.charAt(0) }}</div>
        </div>
        <div class="flex-1 gt-xs:pl-2">
          <input
            id="avatar-file-input"
            type="file"
            [multiple]="false"
            [accept]="'image/jpeg, image/png'"
            (change)="uploadAvatar(avatarFileInput.files)"
            #avatarFileInput
          />
        </div>
      </div> -->

      <div class="flex flex-col gt-sm:flex-row">
        <mat-form-field class="flex-auto gt-sm:pr-2">
          <mat-label>{{ 'settings.profile.firstname' | transloco }}<span class="required"></span></mat-label>
          <input
            matInput
            [placeholder]="'settings.profile.firstname.placeholder' | transloco"
            formControlName="firstName"
          />
          <mat-icon matPrefix [svgIcon]="'account_circle'"></mat-icon>
          <mat-error *ngIf="profileForm.get('firstName').invalid && profileForm.get('firstName').touched">
            {{ 'settings.profile.firstname' | transloco }}
          </mat-error>
        </mat-form-field>
        <mat-form-field class="flex-auto gt-sm:pl-2">
          <mat-label>{{ 'settings.profile.lastname' | transloco }}<span class="required"></span></mat-label>
          <input
            matInput
            [placeholder]="'settings.profile.lastname.placeholder' | transloco"
            formControlName="lastName"
          />
          <mat-icon matPrefix [svgIcon]="'account_circle'"></mat-icon>
          <mat-error *ngIf="profileForm.get('lastName').invalid && profileForm.get('lastName').touched">
            {{ 'settings.profile.name.error' | transloco }}
          </mat-error>
        </mat-form-field>
      </div>
      <div class="flex">
        <mat-form-field class="flex-auto">
          <mat-label>{{ 'settings.profile.job' | transloco }}</mat-label>
          <input matInput [placeholder]="'settings.profile.job.placeholder' | transloco" formControlName="job" />
          <mat-icon matPrefix [svgIcon]="'work'"></mat-icon>
          <mat-error *ngIf="profileForm.get('job').invalid && profileForm.get('job').touched">
            {{ 'settings.profile.job.error' | transloco }}
          </mat-error>
        </mat-form-field>
      </div>
      <div class="flex">
        <mat-form-field class="treo-mat-textarea flex-auto">
          <mat-label>{{ 'settings.profile.bio' | transloco }}</mat-label>
          <textarea
            matInput
            [placeholder]="'settings.profile.bio.placeholder' | transloco"
            [rows]="4"
            #bio
            formControlName="bio"
          ></textarea>
          <mat-icon matPrefix [svgIcon]="'notes'"></mat-icon>
          <mat-hint [align]="'end'">{{ bio.value.length }} / 90</mat-hint>
          <mat-error *ngIf="profileForm.get('bio').invalid && profileForm.get('bio').touched">
            {{ 'settings.profile.bio.error' | transloco }}
          </mat-error>
        </mat-form-field>
      </div>
    </app-form>
  `,
})
export class ProfileComponent implements OnInit {
  title = 'settings.profile.title'
  subtitle = 'settings.profile.subtitle'
  profileForm: FormGroup
  data: ProfileForm

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      avatar: [''],
      firstName: ['', [Validators.required, Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      job: ['', [Validators.maxLength(40), Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      bio: ['', Validators.maxLength(90)],
    })

    this.initForm()
  }

  private initForm(): void {
    const { avatar, firstName, lastName, job, bio } = this.route.parent.snapshot.data['settings']
    this.data = { avatar, firstName, lastName, job, bio } as ProfileForm
    this.profileForm.setValue(this.data)
  }

  onSubmit(values: ProfileForm) {
    // TODO
  }

  onReset(): void {
    this.initForm()
  }

  // uploadAvatar(fileList: FileList): void {
  //   if (!fileList.length) {
  //     return
  //   }
  //   const allowedTypes = ['image/jpeg', 'image/png']
  //   const file = fileList[0]
  //   if (!allowedTypes.includes(file.type)) {
  //     return
  //   }
  //   console.log('TODO: upload the file')
  //   this.service.uploadAvatar(this.contact.id, file).subscribe()
  // }
}
