import { Calque } from '../../model/shared.model'

export class CreateFilters {
  static readonly type = '[filters] create filter calque'
  constructor(public calque: Calque) {}
}
