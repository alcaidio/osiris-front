@HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.map.dragging.disable()
    this.firstPoint = this.map.mouseEventToLayerPoint(event)
    this.isDrawing = true
    this.featuresSelected = []
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDrawing === true) {
      const point = this.map.mouseEventToLayerPoint(event)
      const bounds = new LatLngBounds(this.map.layerPointToLatLng(this.firstPoint), this.map.layerPointToLatLng(point))

      if (this.boxSelection) {
        this.selectionLayer.removeLayer(this.boxSelection)
      }

      this.boxSelection = rectangle(bounds, { color: '#11afb6', weight: 2.5, dashArray: '5px', lineCap: 'square' })
      this.selectionLayer.addLayer(this.boxSelection)
      this.selectionLayer.addTo(this.map)
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (this.isDrawing === true) {
      this.selectionLayer.removeLayer(this.boxSelection)
      this.selectionLayer.removeLayer(geoJSON(this.featuresSelected as any))
      this.featuresSelected = []
      console.log(this.featuresSelected)

      const point = this.map.mouseEventToLayerPoint(event)

      if (this.firstPoint.x !== point.x && this.firstPoint.y !== point.y) {
        this.secondPoint = point
        const bounds = new LatLngBounds(
          this.map.layerPointToLatLng(this.firstPoint),
          this.map.layerPointToLatLng(this.secondPoint)
        )

        Object.values(this.map['_layers']).map((l: Layer) => {
          if (l['feature']) {
            // FIX : use database id
            // get leaflet id  because for the moment feature id is not unique for the moment
            const featureModified = { ...l['feature'], id: l['_leaflet_id'] }

            if (l['feature']['geometry']['type'] === 'Point') {
              const pt = new LatLng(
                l['feature']['geometry']['coordinates'][1],
                l['feature']['geometry']['coordinates'][0]
              )
              if (bounds.contains(pt)) {
                this.featuresSelected.push(featureModified)
              }
            } else {
              const coord = l['feature']['geometry']['coordinates']
              if (bounds.contains(coord)) {
                this.featuresSelected.push(featureModified)
              } else {
                const intersect = booleanIntersects(
                  turfHelper.polygon([createPolygonFromBounds(bounds)]),
                  turfHelper.lineString(coord)
                )
                if (intersect) {
                  this.featuresSelected.push(featureModified)
                }
              }
            }
          }
        })

        this.selectionLayer.addLayer(
          geoJSON(this.featuresSelected as any, {
            style: {
              color: 'black',
              weight: 10,
              fillColor: 'black',
              opacity: 0.4,
              fillOpacity: 0.8,
            },
          })
        )
        console.log('selected', this.featuresSelected)

        this.selectionLayer.addTo(this.map)
      }

      this.isDrawing = false

      // this.map.dragging.enabled()
    }
  }