import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe'

@AutoUnsubscribe()
@Component({
  selector: 'app-form',
  styleUrls: ['form.component.scss'],
  template: `
    <form
      [formGroup]="formGroup"
      class="flex flex-col mt-4 px-8 pt-10 bg-card shadow rounded overflow-hidden max-w-3xl mx-auto"
    >
      <section class="flex flex-col gt-xs:flex-row gt-xs:items-start">
        <div class="gt-xs:max-w-80 gt-xs:pr-12">
          <p class="text-lg font-medium">{{ title | transloco }}</p>
          <p class="text-secondary mb-6">
            {{ subtitle | transloco }}
          </p>
        </div>
        <div class="flex-auto min-w-64">
          <ng-content></ng-content>
        </div>
      </section>

      <div
        class="flex items-center justify-end border-t -mx-8 mt-8 px-8 py-5 light:bg-cool-gray-50 dark:bg-cool-gray-700"
      >
        <button *ngIf="!formDataIsUnchanged" mat-button (click)="onReset()">
          {{ 'settings.button.reset' | transloco }}
        </button>
        <button
          (click)="onSubmitRequest()"
          class="px-6 ml-3"
          mat-flat-button
          [color]="'primary'"
          [disabled]="formGroup && (formGroup.invalid || formDataIsUnchanged)"
        >
          <span *ngIf="!pending">
            {{ 'settings.button.save' | transloco }}
          </span>
          <mat-progress-spinner *ngIf="pending" [diameter]="24" [mode]="'indeterminate'"></mat-progress-spinner>
        </button>
      </div>
    </form>
  `,
})
export class FormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() title: string
  @Input() subtitle: string
  @Input() formGroup: FormGroup
  @Input() data: any
  @Input() pending = false
  @Output() resetForm = new EventEmitter<void>()
  @Output() submitForm = new EventEmitter<any>()

  formDataIsUnchanged = true

  ngOnInit(): void {
    this.formGroup.valueChanges.subscribe((values) => {
      this.checkIfFormHasChanged(this.data, values)
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'formGroup':
          case 'data':
            this.checkIfFormHasChanged(this.data, this.formGroup.value)
            break
        }
      }
    }
  }

  private checkIfFormHasChanged(initial: object, change: object) {
    const changeInArrayAndTrimed = JSON.stringify(Object.values(change).map((e) => (e as string).trim()))
    const initialInArray = JSON.stringify(Object.values(initial))

    if (initialInArray !== changeInArrayAndTrimed) {
      this.formDataIsUnchanged = false
    } else {
      this.formDataIsUnchanged = true
    }
  }

  onSubmitRequest() {
    if (this.formGroup.valid) {
      if (!this.formDataIsUnchanged) {
        this.pending = true
        setTimeout(() => {
          this.submitForm.emit(this.formGroup.value)

          // need to do in containers after
          console.log('Form submit request !')
          this.data = this.formGroup.value
          this.pending = false
        }, 1500)
      }
    } else {
      console.warn('Invalid form')
    }
  }

  onReset() {
    this.resetForm.emit()
  }

  ngOnDestroy() {
    // because of AutoUnsubscribe()
  }
}
