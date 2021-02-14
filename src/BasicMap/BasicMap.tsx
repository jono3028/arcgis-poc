import React , {useEffect, useRef} from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Point from '@arcgis/core/geometry/Point';
import {SimpleRenderer} from '@arcgis/core/renderers';

interface IBaseMapProps {
    locationCount: number
}

const style ={
    width: '1600px',
    height: '900px'
}

const lat= [42.3545187,42.3647439]
const lon = [-71.0739617,-71.0516515]

const getBetweenTwo= (min: number, max: number): number => (Math.random() * (max - min)) + min;

const getLocations = (locationCount: number): number[][] => {
    const locations = [];
    for(let i = 0; i < locationCount; i++) {
        locations.push([getBetweenTwo(lat[0], lat[1]),getBetweenTwo(lon[0], lon[1])])
    }

    return locations;
}

function BaseMap(props: IBaseMapProps) {
const mapEl = useRef(null);

useEffect(() => {
    let view: MapView;
    const map = new Map({
        basemap: 'gray-vector'
    });

    const graphicsLayer = new GraphicsLayer();
    // map.add(graphicsLayer);

    const point = (arr: number[]): Point => new Point ({//Create a point,
        longitude: arr[1],
        latitude: arr[0],  
    })

    const graphic = getLocations(props.locationCount).map((loc: number[], idx) => new Graphic({
        geometry: point(loc),
        attributes: {
            name: idx
        } 
    }))

    const simpleMarkerSymbol  = {
       type: "simple-marker",
       color: [201, 66, 99],  // Primary colour
       outline: {
           color: [255, 255, 255], // White
           width: 1
       }
    };
    const renderer = new SimpleRenderer({symbol: simpleMarkerSymbol})

    let featureLayer = new FeatureLayer({
        title: 'Some Locations',
        source: graphic,
        objectIdField: 'name',
        fields: [
            {
                name: 'name',
                type: 'string'
            }
        ],
        geometryType: 'point',
        renderer,
        popupTemplate: {
            content: "<div>{name}</div>"
          },
    });
    map.add(featureLayer);


     const pointGraphic = new Graphic({
        geometry: point(getLocations(props.locationCount)[1]),
        symbol: simpleMarkerSymbol
     });
     graphicsLayer.add(pointGraphic);

    if (mapEl) {
    view = new MapView({
        map: map,
        center:[-71.062829,42.3581689], // Longitude, latitude
        zoom: 15, // Zoom level
        container: mapEl.current || undefined// Div element
    }); 
    }
    return () => {
        if (!!view) {
            view.destroy(); 
        }
    }
},[]);

    return <div style={style} ref={mapEl} />
}

export default BaseMap