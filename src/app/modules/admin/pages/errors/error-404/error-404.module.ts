import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { TranslocoModule, TRANSLOCO_SCOPE } from '@ngneat/transloco'
import { Error404Component } from './error-404.component'
import { error404Routes } from './error-404.routing'

@NgModule({
  declarations: [Error404Component],
  imports: [RouterModule.forChild(error404Routes), TranslocoModule],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'errors' }],
})
export class Error404Module {}
