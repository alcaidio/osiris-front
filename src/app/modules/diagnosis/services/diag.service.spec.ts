import { HttpClientModule } from '@angular/common/http'
import { TestBed } from '@angular/core/testing'
import { DiagService } from './diag.service'

describe('DiagService', () => {
  let service: DiagService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [DiagService],
    })

    service = TestBed.inject(DiagService)
  })

  it('should get the base map', () => {
    // TODO when real endpoint is real
  })

  it('should get the diag layers', (done) => {
    service.getLayers().subscribe((res) => {
      expect(res).toMatchSnapshot()
      done()
    })
  })

  it('should get the section Id by lngLat', (done) => {
    const point = { lng: 4.291694550962802, lat: 46.287235361177835 }
    service.getSectionIdByLngLat(point).subscribe((res) => {
      expect(res).toMatchSnapshot()
      done()
    })
  })
  it('should get the section by Id', (done) => {
    service.getSectionById(3).subscribe((res) => {
      expect(res).toMatchSnapshot()
      done()
    })
  })

  it('should get the section by lngLat', (done) => {
    const point = { lng: 4.291694550962802, lat: 46.287235361177835 }
    service.getSection(point).subscribe((res) => {
      expect(res).toMatchSnapshot()
      done()
    })
  })
})
