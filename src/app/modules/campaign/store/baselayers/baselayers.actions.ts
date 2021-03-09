export class GetBaselayers {
  static readonly type = '[baselayers] get by map id'
  constructor(public mapId: string) {}
}
