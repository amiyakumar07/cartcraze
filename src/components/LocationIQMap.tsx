import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Compass, Zap, MapPin, Activity, Play, ExternalLink } from 'lucide-react';
import { 
  LOCATIONIQ_API_KEY, 
  fetchOrderLocationApi, 
  reverseGeocodeLocationIQ, 
  type LiveRiderLocation 
} from '../services/locationiq';
import { useApp } from '../context/AppContext';

interface LocationIQMapProps {
  destinationAddress?: string;
  orderId?: string;
  lat?: number;
  lon?: number;
}

export const LocationIQMap: React.FC<LocationIQMapProps> = ({
  destinationAddress,
  orderId = 'QM-849201',
  lat: customLat,
  lon: customLon
}) => {
  const { userCoords, userProfile } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const riderMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);

  const [liveLocation, setLiveLocation] = useState<LiveRiderLocation | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [riderAddress, setRiderAddress] = useState<string>('HSR Layout 27th Main, Bengaluru');

  // Customer Home Coordinates
  const customerLat = customLat ?? userCoords?.lat ?? 12.9250;
  const customerLon = customLon ?? userCoords?.lon ?? 77.6500;

  // Darkstore Pickup Coordinates (HSR Sector 1)
  const darkstoreLat = 12.9100;
  const darkstoreLon = 77.6400;

  const displayAddress = destinationAddress || userProfile?.address || 'Flat 402, Sunshine Apartments, HSR Layout, Bengaluru';

  // Poll live rider location from backend API
  useEffect(() => {
    let isMounted = true;

    const pollLocation = async () => {
      const locationData = await fetchOrderLocationApi(orderId);
      if (isMounted && locationData) {
        setLiveLocation(locationData);
      }
    };

    pollLocation();
    const interval = setInterval(pollLocation, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [orderId]);

  // Trigger movement simulation if toggle enabled
  useEffect(() => {
    if (!isSimulating) return;

    const simTimer = setInterval(async () => {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      try {
        await fetch(`http://${hostname}:4000/api/locationiq/simulate-movement`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ riderId: 'rider-001', stepPercent: 4 })
        });
      } catch (err) {
        console.warn('Simulation trigger error:', err);
      }
    }, 2000);

    return () => clearInterval(simTimer);
  }, [isSimulating]);

  // Current Rider position or fallback interpolation
  const riderLat = liveLocation?.lat ?? 12.9160;
  const riderLon = liveLocation?.lon ?? 77.6440;
  const speed = liveLocation?.speed ?? 32;
  const battery = liveLocation?.battery ?? 88;
  const distanceRemaining = liveLocation?.distanceRemainingKm ?? 1.2;
  const etaMinutes = liveLocation?.etaMinutes ?? 4;
  const riderName = liveLocation?.riderName ?? 'Rahul Kumar';

  // Reverse geocode rider position
  useEffect(() => {
    let isMounted = true;
    reverseGeocodeLocationIQ(riderLat, riderLon).then(res => {
      if (isMounted && res.address) setRiderAddress(res.address);
    });
    return () => { isMounted = false; };
  }, [riderLat, riderLon]);

  // Initialize Leaflet map and render markers & route
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [riderLat, riderLon],
        zoom: 14,
        zoomControl: true,
        attributionControl: false
      });

      mapInstanceRef.current = map;

      // LocationIQ Tile Layer with OpenStreetMap fallback
      const tileUrl = `https://a-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${LOCATIONIQ_API_KEY}`;
      const fallbackTileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tileLayer = L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      });

      tileLayer.on('tileerror', () => {
        tileLayer.setUrl(fallbackTileUrl);
      });

      tileLayer.addTo(map);

      // Darkstore Marker Pin
      const storeIcon = L.divIcon({
        className: 'custom-darkstore-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
            <div style="background: #f59e0b; color: #000; border: 3px solid #ffffff; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.6); font-size: 18px;">
              🏪
            </div>
            <div style="background: #020617; color: #f59e0b; font-size: 9px; font-weight: 900; padding: 2px 8px; border-radius: 10px; border: 1px solid #f59e0b; white-space: nowrap; margin-top: 3px; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
              FreshCart Darkstore
            </div>
          </div>
        `,
        iconSize: [38, 55],
        iconAnchor: [19, 27]
      });
      L.marker([darkstoreLat, darkstoreLon], { icon: storeIcon })
        .bindPopup('<b>FreshCart Express Darkstore</b><br/>Sector 1, HSR Layout')
        .addTo(map);

      // Customer Home Marker Pin
      const homeIcon = L.divIcon({
        className: 'custom-customer-home-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
            <div style="background: #10b981; color: #ffffff; border: 3px solid #ffffff; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.6); font-size: 20px;">
              🏠
            </div>
            <div style="background: #020617; color: #10b981; font-size: 9px; font-weight: 900; padding: 2px 8px; border-radius: 10px; border: 1px solid #10b981; white-space: nowrap; margin-top: 3px; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
              Your Doorstep
            </div>
          </div>
        `,
        iconSize: [40, 57],
        iconAnchor: [20, 28]
      });
      L.marker([customerLat, customerLon], { icon: homeIcon })
        .bindPopup(`<b>Delivery Address</b><br/>${displayAddress}`)
        .addTo(map);

      // Moving Rider Marker
      const riderIcon = L.divIcon({
        className: 'custom-rider-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
            <div style="background: #fdee24; color: #000; border: 3px solid #020617; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 25px rgba(253, 238, 36, 0.9); font-size: 22px; transition: transform 0.5s ease;">
              🛵
            </div>
            <div style="background: #020617; color: #ffffff; font-size: 10px; font-weight: 900; padding: 3px 10px; border-radius: 12px; border: 1.5px solid #fdee24; white-space: nowrap; margin-top: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.6); text-align: center;">
              🛵 ${riderName} • <span style="color: #fdee24;">${speed} km/h</span>
            </div>
          </div>
        `,
        iconSize: [44, 65],
        iconAnchor: [22, 32]
      });

      const riderMarker = L.marker([riderLat, riderLon], { icon: riderIcon }).addTo(map);
      riderMarkerRef.current = riderMarker;

      // Polyline connecting Darkstore -> Rider -> Customer
      const routeLine = L.polyline(
        [[darkstoreLat, darkstoreLon], [riderLat, riderLon], [customerLat, customerLon]],
        { color: '#f59e0b', weight: 4, opacity: 0.8, dashArray: '8, 8' }
      ).addTo(map);
      routeLineRef.current = routeLine;

      // Fit map bounds to encompass store, rider, and customer
      const bounds = L.latLngBounds([
        [darkstoreLat, darkstoreLon],
        [riderLat, riderLon],
        [customerLat, customerLon]
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      // Dynamic update of rider position & route line
      if (riderMarkerRef.current) {
        riderMarkerRef.current.setLatLng([riderLat, riderLon]);
        const updatedRiderIcon = L.divIcon({
          className: 'custom-rider-marker',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
              <div style="background: #fdee24; color: #000; border: 3px solid #020617; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 25px rgba(253, 238, 36, 0.9); font-size: 22px; transition: transform 0.5s ease;">
                🛵
              </div>
              <div style="background: #020617; color: #ffffff; font-size: 10px; font-weight: 900; padding: 3px 10px; border-radius: 12px; border: 1.5px solid #fdee24; white-space: nowrap; margin-top: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.6); text-align: center;">
                🛵 ${riderName} • <span style="color: #fdee24;">${speed} km/h</span>
              </div>
            </div>
          `,
          iconSize: [44, 65],
          iconAnchor: [22, 32]
        });
        riderMarkerRef.current.setIcon(updatedRiderIcon);
      }

      if (routeLineRef.current) {
        routeLineRef.current.setLatLngs([
          [darkstoreLat, darkstoreLon],
          [riderLat, riderLon],
          [customerLat, customerLon]
        ]);
      }
    }
  }, [riderLat, riderLon, speed, riderName, customerLat, customerLon, displayAddress]);

  // Clean cleanup on component destruction
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 flex flex-col relative z-0">
      {/* Top Telemetry Live Status Header */}
      <div className="p-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex justify-between items-center text-xs text-white z-10">
        <div className="flex items-center gap-2 font-black text-amber-400">
          <Compass className="w-4 h-4 text-amber-400 animate-spin" />
          <span>LocationIQ Live Rider Telemetry</span>
          <span className="text-[10px] bg-emerald-950 text-emerald-400 font-extrabold px-2 py-0.5 rounded-full border border-emerald-800 flex items-center gap-1">
            <Activity className="w-3 h-3" />
            <span>REAL-TIME GPS</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`text-[10px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
              isSimulating 
                ? 'bg-amber-400 text-black border border-amber-300 animate-pulse' 
                : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
            }`}
            title="Toggle movement simulation on backend"
          >
            <Play className="w-3 h-3" />
            <span>{isSimulating ? 'Simulating Rider Movement' : 'Test Rider Movement'}</span>
          </button>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div className="w-full h-80 relative z-0">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Bottom Live Telemetry Metrics Card */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-white z-10">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Rider Speed</span>
            <span className="font-mono font-extrabold text-amber-400 text-sm">{speed} km/h</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Distance</span>
            <span className="font-mono font-extrabold text-emerald-400 text-sm">{distanceRemaining} km</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase">ETA</span>
            <span className="font-mono font-extrabold text-yellow-300 text-sm">{etaMinutes} Mins</span>
          </div>
        </div>

        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${customerLat},${customerLon}`}
          target="_blank"
          rel="noreferrer"
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition shadow-sm"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Google Maps</span>
        </a>
      </div>
    </div>
  );
};
