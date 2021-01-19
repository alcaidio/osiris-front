import { Injectable } from '@angular/core'
import { State } from '@ngxs/store'
import { BaselayerState } from './baselayers/baselayers.state'
import { CampaignsState } from './campaigns/campaigns.state'
import { MapState } from './maps/maps.state'
import { OverlayState } from './overlays/overlays.state'

@State({
  name: 'campaign',
  children: [OverlayState, CampaignsState, BaselayerState, MapState],
})
@Injectable()
export class CampaignModuleState {}
