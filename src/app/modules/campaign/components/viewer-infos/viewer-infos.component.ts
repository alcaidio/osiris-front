import { Component, Input } from '@angular/core'
import moment from 'moment'
import { Picture, PicturePoint } from './../../../../shared/models/maps.model'

type LangType = 'fr' | 'en'

@Component({
  selector: 'app-viewer-infos',
  templateUrl: './viewer-infos.component.html',
  styleUrls: ['./viewer-infos.component.scss'],
})
export class ViewerInfosComponent {
  @Input() point: PicturePoint
  @Input() picture: Picture

  // TODO other lang
  getDate(time: number, lang: LangType) {
    if (lang === 'fr') {
      const duration = new Date(time)
      return moment(duration).locale('fr').format('Do MMMM YYYY à hh:mm:ss')
    }
  }
}
