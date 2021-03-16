import { Component, EventEmitter, Input, Output } from '@angular/core'
import moment from 'moment'
import { CameraPositionType, LangType, NeighboursDirectionType, Picture, PicturePoint } from '../../model/shared.model'

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
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
  @Output() goToNeighbours = new EventEmitter<NeighboursDirectionType>()

  onChangeCameraPosition(position: CameraPositionType): void {
    this.changeCamera.emit(position)
  }

  onChangeNeighboursDirection(direction: NeighboursDirectionType) {
    this.goToNeighbours.emit(direction)
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
