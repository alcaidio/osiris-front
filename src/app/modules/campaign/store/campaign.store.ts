import { Injectable } from '@angular/core'
import { State } from '@ngxs/store'
import { BaselayerState } from './baselayers/baselayers.state'
import { CalqueState } from './calques/calques.state'
import { CampaignsState } from './campaigns/campaigns.state'
import { FilterState } from './filters/filters.state'
import { MapState } from './maps/maps.state'
import { OverlayState } from './overlays/overlays.state'
import { PicturesState } from './pictures/pictures.state'
import { UIState } from './ui/ui.state'

@State({
  name: 'campaign',
  children: [OverlayState, CampaignsState, BaselayerState, MapState, CalqueState, FilterState, UIState, PicturesState],
})
@Injectable()
export class CampaignModuleState {}
