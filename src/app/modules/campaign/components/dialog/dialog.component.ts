import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { cleanString } from '../../utils'

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  selected: string
  isLoadingResults = true
  styleArray: any

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.selected = cleanString(this.data.calque.legend)
    this.styleArray = [] // GET THE STYLE AND PUT IT IN THE TABLE

    setTimeout(() => (this.isLoadingResults = false), 2000)
  }

  cleanStr(str: string) {
    return cleanString(str)
  }

  onChange(value: string) {
    console.log(`ACTION: Set active style to '${value}' for the calque '${this.data.calque.name}'`)
  }
}
