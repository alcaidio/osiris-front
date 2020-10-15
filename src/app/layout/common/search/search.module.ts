import { Overlay } from '@angular/cdk/overlay'
import { NgModule } from '@angular/core'
import { MatAutocompleteModule, MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete'
import { RouterModule } from '@angular/router'
import { SearchComponent } from 'app/layout/common/search/search.component'
import { SharedModule } from 'app/shared/shared.module'

@NgModule({
  declarations: [SearchComponent],
  imports: [
    RouterModule.forChild([]),
    MatAutocompleteModule,
    SharedModule,
  ],
  exports: [SearchComponent],
  providers: [
    {
      provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
      useFactory: (overlay: Overlay) => {
        return () => overlay.scrollStrategies.block()
      },
      deps: [Overlay],
    },
  ],
})
export class SearchModule {}
