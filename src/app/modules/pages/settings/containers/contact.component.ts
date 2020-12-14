import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { ContactForm } from './../models/settings.model'

@Component({
  selector: 'app-contact',
  template: `
    <app-form
      [formGroup]="contactForm"
      [title]="title"
      [subtitle]="subtitle"
      [data]="data"
      (resetForm)="onReset()"
      (submitForm)="onSubmit($event)"
    >
      <div class="flex-auto min-w-64">
        <div class="flex">
          <mat-form-field class="flex-auto">
            <mat-label>{{ 'settings.contact.email' | transloco }}<span class="required"></span></mat-label>
            <input matInput type="email" [placeholder]="'mail@company.com'" formControlName="email" />
            <mat-icon matPrefix [svgIcon]="'mail'"></mat-icon>
            <mat-error *ngIf="contactForm.get('email').invalid && contactForm.get('email').touched">
              {{ 'settings.contact.email.error' | transloco }}
            </mat-error>
          </mat-form-field>
        </div>
        <div class="flex">
          <mat-form-field class="flex-auto">
            <mat-label>{{ 'settings.contact.phone' | transloco }}</mat-label>
            <input matInput [placeholder]="'0X XX XX XX XX'" formControlName="phone" />
            <mat-icon matPrefix [svgIcon]="'phone'"></mat-icon>
            <mat-error *ngIf="contactForm.get('phone').invalid && contactForm.get('phone').touched">
              {{ 'settings.contact.phone.error' | transloco }}
            </mat-error>
          </mat-form-field>
        </div>
      </div>
    </app-form>
  `,
})
export class ContactComponent implements OnInit {
  title = 'settings.contact.title'
  subtitle = 'settings.contact.subtitle'
  contactForm: FormGroup
  data: ContactForm

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.pattern('[0-9]{10}')],
    })

    this.initForm()
  }

  private initForm(): void {
    const { email, phone } = this.route.parent.snapshot.data['settings']
    this.data = { email, phone } as ContactForm
    this.contactForm.setValue(this.data)
  }

  onSubmit(values: ContactForm): void {
    // TODO
  }

  onReset(): void {
    this.initForm()
  }
}
