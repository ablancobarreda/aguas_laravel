import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet en React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function CubaMap({ stations = [], onStationClick, onViewDetails, selectedStationId = null }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Coordenadas de Cuba (centro aproximado)
    const cubaCenter = [21.5, -80.0];
    const cubaBounds = [
      [19.5, -84.9], // Suroeste
      [23.2, -74.1]  // Noreste
    ];

    // Inicializar el mapa si no existe
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        center: cubaCenter,
        zoom: 7,
        minZoom: 6,
        maxZoom: 12,
        maxBounds: cubaBounds,
        maxBoundsViscosity: 1.0,
        zoomControl: true, // Habilitar controles de zoom explícitamente
      });

      // Asegurar que los controles de zoom estén en la esquina inferior derecha
      L.control.zoom({
        position: 'bottomright'
      }).addTo(mapInstanceRef.current);

      // Agregar capa de OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Limpiar marcadores anteriores
    markersRef.current.forEach(marker => {
      map.removeLayer(marker);
    });
    markersRef.current = [];

    // Agregar marcadores para cada estación
    console.log('CubaMap - Total stations:', stations.length);
    console.log('CubaMap - Sample station:', stations[0]);
    let validStations = 0;

    stations.forEach(station => {
      // Las coordenadas pueden venir como string o número
      let lat = station.latitude;
      let lng = station.longitude;

      // Si son null o undefined, saltar
      if (lat === null || lat === undefined || lng === null || lng === undefined) {
        console.log(`Station ${station.id}: Missing coordinates`);
        return;
      }

      // Convertir a número si es string
      if (typeof lat === 'string') {
        lat = parseFloat(lat);
      }
      if (typeof lng === 'string') {
        lng = parseFloat(lng);
      }

      // Verificar si las coordenadas pueden estar invertidas
      // Si lat está en rango de lng de Cuba o viceversa, intercambiar
      const cubaLatRange = [19, 24];
      const cubaLngRange = [-85, -74];

      let finalLat = lat;
      let finalLng = lng;

      // Si lat está en el rango de longitud de Cuba, probablemente están invertidas
      if (lat >= cubaLngRange[0] && lat <= cubaLngRange[1] &&
          lng >= cubaLatRange[0] && lng <= cubaLatRange[1]) {
        console.log(`Station ${station.id}: Coordinates appear inverted, swapping...`);
        finalLat = lng;
        finalLng = lat;
      }

      // Validar coordenadas para Cuba (lat: 19-24, lng: -85 a -74)
      const isValidLat = !isNaN(finalLat) && finalLat >= 19 && finalLat <= 24;
      const isValidLng = !isNaN(finalLng) && finalLng >= -85 && finalLng <= -74;

      console.log(`Station ${station.id}: lat=${finalLat}, lng=${finalLng}, valid=${isValidLat && isValidLng}`);

      // Solo agregar marcador si tiene coordenadas válidas y están en el rango de Cuba
      if (isValidLat && isValidLng) {
        validStations++;
        // Determinar color del marcador según el estado
        const getMarkerColor = (station) => {
          // Si tiene canales con datos recientes, verde
          if (station.channels && station.channels.length > 0) {
            const hasData = station.channels.some(ch =>
              ch.latest_value !== null && ch.latest_value !== undefined
            );
            return hasData ? '#10B981' : '#6B7280'; // Verde si tiene datos, gris si no
          }
          return '#6B7280'; // Gris por defecto
        };

        // Crear icono personalizado usando el SVG del sidebar
        const markerColor = getMarkerColor(station);
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              background-color: ${markerColor};
              width: 32px;
              height: 32px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="white">
                <path d="M200-120q-33 0-56.5-23.5T120-200v-160q0-33 23.5-56.5T200-440h400v-160h80v160h80q33 0 56.5 23.5T840-360v160q0 33-23.5 56.5T760-120H200Zm0-80h560v-160H200v160Zm80-40q17 0 28.5-11.5T320-280q0-17-11.5-28.5T280-320q-17 0-28.5 11.5T240-280q0 17 11.5 28.5T280-240Zm140 0q17 0 28.5-11.5T460-280q0-17-11.5-28.5T420-320q-17 0-28.5 11.5T380-280q0 17 11.5 28.5T420-240Zm140 0q17 0 28.5-11.5T600-280q0-17-11.5-28.5T560-320q-17 0-28.5 11.5T520-280q0 17 11.5 28.5T560-240Zm10-390-58-58q26-24 58-38t70-14q38 0 70 14t58 38l-58 58q-14-14-31.5-22t-38.5-8q-21 0-38.5 8T570-630ZM470-730l-56-56q44-44 102-69t124-25q66 0 124 25t102 69l-56 56q-33-33-76.5-51.5T640-800q-50 0-93.5 18.5T470-730ZM200-200v-160 160Z"/>
              </svg>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        const marker = L.marker([finalLat, finalLng], {
          icon: customIcon,
          stationId: station.id // Guardar el ID de la estación en el marcador
        });
        marker.addTo(map);
        console.log(`Marker added for station ${station.id} at [${finalLat}, ${finalLng}]`);

        // Crear tooltip (hover) con información básica
        const localityName = station.locality?.name || '';
        const municipalityName = station.locality?.municipality?.name || '';
        const provinceName = station.locality?.municipality?.province?.name || '';
        const locationText = [localityName, municipalityName, provinceName].filter(Boolean).join(', ');

        const tooltipContent = `
          <div style="font-family: system-ui, -apple-system, sans-serif;">
            <strong style="font-size: 14px; color: #1F2937;">${station.location || station.id}</strong>
            ${locationText ? `<div style="font-size: 12px; color: #6B7280; margin-top: 2px;">${locationText}</div>` : ''}
          </div>
        `;

        marker.bindTooltip(tooltipContent, {
          permanent: false,
          direction: 'top',
          offset: [0, -10],
          className: 'custom-tooltip'
        });

        // Función helper para obtener color según valor
        const getRainfallColor = (value) => {
          if (value === null || value === undefined) return '#6B7280';
          if (value === 0) return '#9CA3AF';
          if (value > 0 && value <= 50) return '#8B5CF6';
          if (value > 50 && value <= 100) return '#3B82F6';
          if (value > 100 && value <= 150) return '#06B6D4';
          if (value > 150 && value <= 200) return '#10B981';
          if (value > 200 && value <= 250) return '#F59E0B';
          if (value > 250) return '#EF4444';
          return '#6B7280';
        };

        const formatValue = (value, unit = '') => {
          if (value === null || value === undefined) return 'Sin datos';
          return `${value} ${unit}`.trim();
        };

        // Encontrar canales específicos
        const findChannel = (name) => {
          return station.channels?.find(ch => ch.name === name);
        };

        const channel01 = findChannel('01'); // Lluvia actual 5min
        const channel02 = findChannel('02'); // Lluvia Ult Hora
        const channel03 = findChannel('03'); // Acum. Lluvia Ayer
        const channel05 = findChannel('05'); // Acum. Lluvia Hoy
        const batteryValue = station.battery;

        // Crear popup con información completa de la estación
        const popupContent = `
          <div style="width: 300px; max-width: calc(100vw - 40px); font-family: system-ui, -apple-system, sans-serif; word-wrap: break-word; overflow-wrap: break-word;" >
            <!-- Header -->
            <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #E5E7EB;">
              <h3 style="margin: 0 0 4px 0; font-size: 18px; font-weight: bold; color: #1F2937;">
                ${station.location || 'Desarrollo'}
              </h3>
              <p style="margin: 0; font-size: 12px; color: #6B7280;">
                ID: ${station.id}
              </p>
              ${station.last_record_date ? `
                <div style="margin-top: 8px; display: flex; align-items: center; justify-content: flex-end; font-size: 11px; color: #05249E;">
                  <span>${station.last_record_date}</span>
                </div>
              ` : ''}
            </div>

            <!-- Datos de lluvia y batería -->
            <div style="margin-bottom: 12px;">
              ${channel01 ? `
                <div style="margin-bottom: 8px; padding: 8px; background-color: #F9FAFB; border-left: 4px solid ${getRainfallColor(channel01.latest_value)}; border-radius: 4px;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; gap: 8px;">
                    <span style="font-size: 12px; font-weight: 600; color: #1F2937; flex-shrink: 0;">Lluvia actual 5min</span>
                    ${channel01.time_info ? `<span style="font-size: 10px; color: #6B7280; font-style: italic; text-align: right; white-space: nowrap; flex-shrink: 0;">${channel01.time_info}</span>` : ''}
                  </div>
                  <div style="font-size: 14px; font-weight: bold; color: ${getRainfallColor(channel01.latest_value)};">
                    ${formatValue(channel01.latest_value, channel01.unidad_medida || 'mm')}
                  </div>
                </div>
              ` : ''}

              ${channel02 ? `
                <div style="margin-bottom: 8px; padding: 8px; background-color: #F9FAFB; border-left: 4px solid ${getRainfallColor(channel02.latest_value)}; border-radius: 4px;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; gap: 8px;">
                    <span style="font-size: 12px; font-weight: 600; color: #1F2937; flex-shrink: 0;">Lluvia Ult Hora</span>
                    ${channel02.time_info ? `<span style="font-size: 10px; color: #6B7280; font-style: italic; text-align: right; white-space: nowrap; flex-shrink: 0;">${channel02.time_info}</span>` : ''}
                  </div>
                  <div style="font-size: 14px; font-weight: bold; color: ${getRainfallColor(channel02.latest_value)};">
                    ${formatValue(channel02.latest_value, channel02.unidad_medida || 'mm')}
                  </div>
                </div>
              ` : ''}

              ${channel03 ? `
                <div style="margin-bottom: 8px; padding: 8px; background-color: #F9FAFB; border-left: 4px solid ${getRainfallColor(channel03.latest_value)}; border-radius: 4px;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; gap: 8px;">
                    <span style="font-size: 12px; font-weight: 600; color: #1F2937; flex-shrink: 0;">Acum. Lluvia Ayer</span>
                    ${channel03.time_info ? `<span style="font-size: 10px; color: #6B7280; font-style: italic; text-align: right; white-space: nowrap; flex-shrink: 0;">${channel03.time_info}</span>` : ''}
                  </div>
                  <div style="font-size: 14px; font-weight: bold; color: ${getRainfallColor(channel03.latest_value)};">
                    ${formatValue(channel03.latest_value, channel03.unidad_medida || 'mm')}
                  </div>
                </div>
              ` : ''}

              ${channel05 ? `
                <div style="margin-bottom: 8px; padding: 8px; background-color: #F9FAFB; border-left: 4px solid ${getRainfallColor(channel05.latest_value)}; border-radius: 4px;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; gap: 8px;">
                    <span style="font-size: 12px; font-weight: 600; color: #1F2937; flex-shrink: 0;">Acum. Lluvia Hoy</span>
                    ${channel05.time_info ? `<span style="font-size: 10px; color: #6B7280; font-style: italic; text-align: right; white-space: nowrap; flex-shrink: 0;">${channel05.time_info}</span>` : ''}
                  </div>
                  <div style="font-size: 14px; font-weight: bold; color: ${getRainfallColor(channel05.latest_value)};">
                    ${formatValue(channel05.latest_value, channel05.unidad_medida || 'mm')}
                  </div>
                </div>
              ` : ''}

              ${batteryValue !== null && batteryValue !== undefined ? `
                <div style="margin-bottom: 8px; padding: 8px; background-color: #F9FAFB; border-left: 4px solid ${getRainfallColor(parseFloat(batteryValue))}; border-radius: 4px;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; gap: 8px;">
                    <span style="font-size: 12px; font-weight: 600; color: #1F2937; flex-shrink: 0;">Batería</span>
                    ${station.last_record_date ? `<span style="font-size: 10px; color: #6B7280; font-style: italic; text-align: right; white-space: nowrap; flex-shrink: 0;">${station.last_record_date}</span>` : ''}
                  </div>
                  <div style="font-size: 14px; font-weight: bold; color: ${getRainfallColor(parseFloat(batteryValue))};">
                    ${formatValue(batteryValue, '%')}
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- Botón -->
            <button
              id="station-btn-${station.id}"
              style="
                margin-top: 8px;
                padding: 8px 16px;
                background-color: #05249E;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                width: 100%;
                transition: background-color 0.2s;
              "
              onmouseover="this.style.backgroundColor='#041a7a'"
              onmouseout="this.style.backgroundColor='#05249E'"
            >
              Ver Información
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);

        // Agregar evento de click en el marcador (abre popup)
        marker.on('click', () => {
          marker.openPopup();
        });

        // Agregar evento de click en el botón del popup
        marker.on('popupopen', () => {
          // Usar setTimeout para asegurar que el DOM esté actualizado
          setTimeout(() => {
            const btn = document.getElementById(`station-btn-${station.id}`);
            if (btn) {
              // Remover cualquier listener anterior
              const newBtn = btn.cloneNode(true);
              btn.parentNode.replaceChild(newBtn, btn);

              newBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (onViewDetails) {
                  onViewDetails(station);
                }
              });
            }
          }, 100);
        });

        markersRef.current.push(marker);
      }
    });

    console.log('CubaMap - Valid stations with coordinates:', validStations);
    console.log('CubaMap - Markers created:', markersRef.current.length);

    // Si hay una estación seleccionada, centrar el mapa en ella
    if (selectedStationId && markersRef.current.length > 0) {
      const selectedMarker = markersRef.current.find(m => {
        const stationId = m.options?.stationId;
        return stationId === selectedStationId;
      });

      if (selectedMarker) {
        const latlng = selectedMarker.getLatLng();
        map.setView(latlng, 12, { animate: true, duration: 0.5 });
        // Abrir popup después de un pequeño delay para que la animación termine
        setTimeout(() => {
          selectedMarker.openPopup();
        }, 600);
        return; // Salir temprano si hay una estación seleccionada
      }
    }

    // Si no hay estación seleccionada o no se encontró el marcador, ajustar a todas las estaciones
    if (markersRef.current.length > 0) {
      // Ajustar el zoom para mostrar todas las estaciones si hay marcadores
      try {
        const group = new L.featureGroup(markersRef.current);
        map.fitBounds(group.getBounds().pad(0.1));
      } catch (e) {
        console.error('Error fitting bounds:', e);
        // Si hay error, mantener el zoom por defecto
        map.setView(cubaCenter, 7);
      }
    } else {
      console.warn('No valid markers to display. Check station coordinates.');
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        markersRef.current.forEach(marker => {
          mapInstanceRef.current.removeLayer(marker);
        });
      }
    };
  }, [stations, onStationClick, selectedStationId]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <div ref={mapRef} style={{ height: '100%', width: '100%', zIndex: 0 }} />
      <style>{`
        .leaflet-container {
          background-color: #f8fafc;
        }
        .leaflet-control-zoom {
          position: absolute !important;
          bottom: 20px !important;
          right: 20px !important;
          top: auto !important;
          left: auto !important;
          margin: 0 !important;
        }
        .leaflet-top.leaflet-right {
          top: auto !important;
          bottom: 20px !important;
          right: 20px !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          overflow: hidden;
        }
        .leaflet-popup-content {
          margin: 16px;
          width: auto !important;
          max-width: calc(100vw - 40px);
          overflow-wrap: break-word;
          word-wrap: break-word;
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-tooltip {
          z-index: 35 !important;
        }
        @media (min-width: 1024px) {
          .leaflet-tooltip {
            z-index: 250 !important;
          }
        }
        .custom-tooltip {
          background: rgba(255, 255, 255, 0.95) !important;
          border: 1px solid #E5E7EB !important;
          border-radius: 6px !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
          padding: 8px 12px !important;
          font-size: 13px !important;
          z-index: inherit !important;
        }
        .leaflet-tooltip-top:before {
          border-top-color: #E5E7EB !important;
        }
        .leaflet-tooltip-bottom:before {
          border-bottom-color: #E5E7EB !important;
        }
        .leaflet-tooltip-left:before {
          border-left-color: #E5E7EB !important;
        }
        .leaflet-tooltip-right:before {
          border-right-color: #E5E7EB !important;
        }
      `}</style>
    </div>
  );
}

