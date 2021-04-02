import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'title',
})
export class TitlePipe implements PipeTransform {
  transform(value: string): string {
    const val = value.toLowerCase()
    return val.charAt(0).toUpperCase() + val.slice(1)
  }
}
