import { Component, OnInit } from '@angular/core'
import { SECTIONS } from './sections'

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  sections: any

  constructor() {}

  ngOnInit(): void {
    this.sections = SECTIONS.features
  }
}
