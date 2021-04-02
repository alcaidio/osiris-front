import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import moment from 'moment'
import { CameraPositionType, LangType, Picture, PicturePoint } from '../../model/campaign.model'
import { ImageType, NeighboursDirectionType } from './../../model/campaign.model'

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewerComponent {
  @Input() picture: Picture
  @Input() point: PicturePoint
  @Input() isOpen: boolean
  @Input() isFullscreen: boolean
  @Input() isLoading: boolean
  @Output() closeViewer = new EventEmitter<void>()
  @Output() toggleFullscreen = new EventEmitter<void>()
  @Output() changeCamera = new EventEmitter<CameraPositionType>()
  @Output() goToNeighbours = new EventEmitter<{ dir: NeighboursDirectionType; imageType: ImageType }>()

  onChangeCameraPosition(position: CameraPositionType): void {
    this.changeCamera.emit(position)
  }

  onChangeNeighboursDirection(evt: { dir: NeighboursDirectionType; imageType: ImageType }) {
    const { dir, imageType } = evt
    this.goToNeighbours.emit({ dir, imageType })
  }

  onCloseViewer(): void {
    this.closeViewer.emit()
  }

  onToggleFullscreen(): void {
    this.toggleFullscreen.emit()
  }

  get viewerImageInfos(): string {
    return 'Caméra "' + this.picture?.camera + '" - ' + this.getDate(this.point?.timestamp, 'fr')
  }

  // TODO other lang
  private getDate(time: number, lang: LangType) {
    if (lang === 'fr') {
      const duration = new Date(time)
      return moment(duration).locale('fr').format('Do MMMM YYYY à hh:mm:ss')
    }
  }
}
