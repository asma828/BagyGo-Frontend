import { Component, Input, OnInit, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `<div #mapContainer class="map-container"></div>`,
  styles: [`
    .map-container {
      height: 100%;
      width: 100%;
      min-height: 300px;
      border-radius: 12px;
      z-index: 1;
    }
  `]
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  
  @Input() lat: number | null = null;
  @Input() lng: number | null = null;
  @Input() zoom: number = 13;
  @Input() markerLabel: string = 'Current Location';

  private map?: L.Map;
  private marker?: L.Marker;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.map && (changes['lat'] || changes['lng'])) {
      this.updateMarker();
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    if (!this.mapContainer) return;

    const initialLat = this.lat || 33.5731; // Default to Casablanca
    const initialLng = this.lng || -7.5898;

    this.map = L.map(this.mapContainer.nativeElement).setView([initialLat, initialLng], this.zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.updateMarker();
    
    // Fix for Leaflet missing icons in Angular
    const originalIconFunction = L.Marker.prototype.options.icon;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      iconUrl: 'assets/leaflet/marker-icon.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
    });
  }

  private updateMarker(): void {
    if (!this.map || this.lat === null || this.lng === null) return;

    if (this.marker) {
      this.marker.setLatLng([this.lat, this.lng]);
    } else {
      this.marker = L.marker([this.lat, this.lng]).addTo(this.map);
    }

    if (this.markerLabel) {
      this.marker.bindPopup(this.markerLabel).openPopup();
    }

    this.map.panTo([this.lat, this.lng]);
  }
}
