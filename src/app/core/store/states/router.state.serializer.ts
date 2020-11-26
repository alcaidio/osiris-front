import { RouterStateSnapshot } from '@angular/router'
import { RouterStateSerializer } from '@ngxs/router-plugin'
import { RouterStateModel } from './../../../shared/models/router.model'

export class CustomRouterStateSerializer implements RouterStateSerializer<RouterStateModel> {
  serialize(routerState: RouterStateSnapshot): RouterStateModel {
    const {
      url,
      root: { queryParams },
    } = routerState

    let { root: route } = routerState
    while (route.firstChild) {
      route = route.firstChild
    }

    const { params, data } = route

    if (route.params.title) {
      data.title = route.params.title
    }

    return { url, params, queryParams, data }
  }
}
