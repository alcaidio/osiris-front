import { TestBed } from '@angular/core/testing'
import { MarzipanoService } from './marzipano.service'


describe('MarzipanoService', () => {
  let service: MarzipanoService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(MarzipanoService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
