import { TestBed, waitForAsync } from '@angular/core/testing'
import { NgxsModule, Store } from '@ngxs/store'
import { MockProvider } from 'ngx-mock-provider'
import { generateMockLayer, Layer } from '../../models/layer.model'
import { DiagService } from '../../services/diag.service'
import { LoadLayers, LoadLayersFailure, LoadLayersSuccess, ToggleLayer } from '../actions/layer.action'
import { LayersState, layersStateDefaults } from '../states/layer.state'

describe('Layers State', () => {
  let store: Store

  const layer1: Layer = generateMockLayer('1')
  const layer2: Layer = generateMockLayer('2')

  const ids: string[] = [layer1.id, layer2.id]
  const entities: { [id: string]: Layer } = {
    [layer1.id]: layer1,
    [layer2.id]: layer2,
  }

  const layerStateLoaded = {
    ...layersStateDefaults,
    ids,
    entities,
    loaded: true,
  }

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NgxsModule.forRoot([LayersState])],
        providers: [
          MockProvider({
            provider: DiagService,
          }),
        ],
      }).compileComponents()

      store = TestBed.inject(Store)
      store.reset({ layers: layersStateDefaults })
    })
  )

  it('[selector] it should get layers entities', () => {
    const selector = LayersState.getEntities(layerStateLoaded)
    expect(selector).toEqual(layerStateLoaded.entities)
  })

  it('[selector] it should get layers', () => {
    const selector = LayersState.getLayers(layerStateLoaded)
    expect(selector).toEqual(Object.values(layerStateLoaded.entities))
  })

  it('[selector] it should get filter', () => {
    const selector = LayersState.getFilter(layerStateLoaded)
    const expected = [
      { id: layer1.id, name: layer1.name, visible: layer1.visible },
      { id: layer2.id, name: layer2.name, visible: layer2.visible },
    ]
    expect(selector).toEqual(expected)
  })

  it(
    '[action] it should load a layer',
    waitForAsync(() => {
      store.dispatch(new LoadLayers())
      const actualLayerState = store.selectSnapshot((state) => state.layers)
      expect(actualLayerState).toEqual({ ...layersStateDefaults, loading: true })
    })
  )

  it(
    '[action] it should load a layer with success',
    waitForAsync(() => {
      store.dispatch(new LoadLayersSuccess([layer1, layer2]))
      const actualLayerState = store.selectSnapshot((state) => state.layers)
      expect(actualLayerState).toEqual(layerStateLoaded)
    })
  )

  it(
    '[action] it should load a layer with failure',
    waitForAsync(() => {
      store.dispatch(new LoadLayersFailure('some-error'))
      const actualLayerState = store.selectSnapshot((state) => state.layers)
      expect(actualLayerState).toEqual({ ...layersStateDefaults, error: 'some-error' })
    })
  )

  it(
    '[action] it should load layer1 and 2 with success and toggle the layer2',
    waitForAsync(() => {
      store.dispatch(new LoadLayersSuccess([layer1, layer2]))
      store.dispatch(new ToggleLayer(layer2.id))
      const actualLayerState = store.selectSnapshot((state) => state.layers)
      expect(actualLayerState).toEqual({
        ...layerStateLoaded,
        entities: { ...actualLayerState.entities, [layer2.id]: { ...layer2, visible: !layer2.visible } },
      })
    })
  )
})
