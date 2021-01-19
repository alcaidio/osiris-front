export class GetBaselayers {
  static readonly type = '[baselayers] get'
  constructor(public baselayerIds: string[]) {}
}
