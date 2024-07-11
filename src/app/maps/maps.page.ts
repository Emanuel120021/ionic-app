import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { base_url } from 'src/environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit, AfterViewInit {
  map?: mapboxgl.Map;
  marker?: mapboxgl.Marker;

  constructor() {}

  ngOnInit() {
    (mapboxgl as any).accessToken = base_url.token_mapbox; // Substitua pelo seu token
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.map = new mapboxgl.Map({
        container: 'mapbox', // ID do elemento HTML onde o mapa será renderizado
        style: 'mapbox://styles/mapbox/satellite-v9', // Estilo do mapa
        center: [-35.20319, -5.89031], //lng, lat
        zoom: 17,
      });

      this.map.on('load', () => {
        this.getLocation(); // Chama a função para obter a localização após a inicialização do mapa
        this.fetchRoute();
      });
    }, 300);
  }

  onGetLocation() {
    this.getLocation();
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          console.log(`Longitude: ${longitude}, Latitude: ${latitude}`);

          // Centraliza o mapa na localização atual do usuário
          if (this.map) {
            this.map.setCenter([longitude, latitude]);

            // Remove o marcador anterior, se existir
            if (this.marker) {
              this.marker.remove();
            }

            const markerElement = document.createElement('div');
            markerElement.className = 'custom-marker';
            markerElement.style.backgroundImage = 'url(../assets/icon/pin.png)'; // Substitua pelo caminho do seu ícone
            markerElement.style.width = '50px';
            markerElement.style.height = '50px';
            markerElement.style.backgroundSize = '100%';

            // Adiciona um novo marcador na localização atual
            this.marker = new mapboxgl.Marker({ element: markerElement })
              .setLngLat([longitude, latitude])
              .addTo(this.map);
          }
        },
        (error) => {
          console.error('Erro ao capturar localização', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.error('Geolocalização não é suportada nesse navegador.');
    }
  }

  fetchRoute() {
    const start = [-35.24526433333333, -5.9333605]; // Ponto inicial
    const end = [-35.2874285, -5.9496823]; // Ponto final

    // Chama a Directions API para obter a rota
    fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start.join(
        ','
      )};${end.join(',')}?geometries=geojson&access_token=${
        base_url.token_mapbox
      }`
    )
      .then((response) => response.json())
      .then((data) => {
        const route = data.routes[0].geometry;
        localStorage.setItem('storedRoute', JSON.stringify(route));
        this.drawRoute(route);
      })
      .catch((error) => console.error('Erro ao obter rota', error));
  }

  drawRoute(route: any) {
    if (this.map) {
      // Adiciona a rota como uma source ao mapa
      this.map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: route,
        },
      });

      // Adiciona uma layer para desenhar a rota
      this.map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
        },
      });

      const start = route.coordinates[0];
      const end = route.coordinates[route.coordinates.length - 1];

      // Adiciona marcadores para o ponto inicial e final
      new mapboxgl.Marker().setLngLat(start).addTo(this.map);
      new mapboxgl.Marker().setLngLat(end).addTo(this.map);
    }
  }
}
