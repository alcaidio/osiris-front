import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { TranslocoModule, TRANSLOCO_SCOPE } from '@ngneat/transloco'
import { Error500Component } from './error-500.component'
import { error500Routes } from './error-500.routing'

@NgModule({
  declarations: [Error500Component],
  imports: [RouterModule.forChild(error500Routes), TranslocoModule],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'errors' }],
})
export class Error500Module {}
