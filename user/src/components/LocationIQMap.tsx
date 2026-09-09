import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Compass, Activity, Play, ExternalLink } from 'lucide-react';
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

  const customerLat = customLat ?? userCoords?.lat ?? 12.9250;
  const customerLon = customLon ?? userCoords?.lon ?? 77.6500;

  const darkstoreLat = 12.9100;
  const darkstoreLon = 77.6400;

  const displayAddress = destinationAddress || userProfile?.address || 'Flat 402, Sunshine Apartments, HSR Layout, Bengaluru';

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

  const riderLat = liveLocation?.lat ?? 12.9160;
  const riderLon = liveLocation?.lon ?? 77.6440;
  const speed = liveLocation?.speed ?? 32;
  const battery = liveLocation?.battery ?? 88;
  const distanceRemaining = liveLocation?.distanceRemainingKm ?? 1.2;
  const etaMinutes = liveLocation?.etaMinutes ?? 4;
  const riderName = liveLocation?.riderName ?? 'Rahul Kumar';

  useEffect(() => {
    let isMounted = true;
    reverseGeocodeLocationIQ(riderLat, riderLon).then(res => {
      if (isMounted && res) {
        // location checked
      }
    });
    return () => { isMounted = false; };
  }, [riderLat, riderLon]);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    try {
      const map = L.map(mapContainerRef.current, {
        center: [riderLat, riderLon],
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      const tileUrl = `https://a-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${LOCATIONIQ_API_KEY}`;
      L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: 'abc'
      }).addTo(map);

      const darkstoreIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `
          <div style="background: #1e293b; color: #fdee24; padding: 6px 10px; border-radius: 12px; font-weight: 900; font-size: 11px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2px solid #fdee24; display: flex; align-items: center; gap: 4px;">
            🏬 Darkstore
          </div>
        `,
        iconSize: [80, 30],
        iconAnchor: [40, 15]
      });
      L.marker([darkstoreLat, darkstoreLon], { icon: darkstoreIcon })
        .addTo(map)
        .bindPopup('<b>CartCraze Express Darkstore #04</b><br/>Item packed & ready for delivery');

      const customerIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `
          <div style="background: #ef4444; color: white; padding: 6px 10px; border-radius: 12px; font-weight: 900; font-size: 11px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2px solid white; display: flex; align-items: center; gap: 4px;">
            🏠 You
          </div>
        `,
        iconSize: [60, 30],
        iconAnchor: [30, 15]
      });
      L.marker([customerLat, customerLon], { icon: customerIcon })
        .addTo(map)
        .bindPopup(`<b>Delivery Address</b><br/>${displayAddress}`);

      const riderIcon = L.divIcon({
        className: 'custom-map-icon rider-pulse-icon',
        html: `
          <div style="position: relative;">
            <div style="position: absolute; inset: -6px; background: rgba(251, 191, 36, 0.4); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="background: #000000; color: #fdee24; width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 6px 16px rgba(0,0,0,0.4); border: 3px solid #fdee24;">
              🛵
            </div>
          </div>
        `,
        iconSize: [42, 42],
        iconAnchor: [21, 21]
      });

      const riderMarker = L.marker([riderLat, riderLon], { icon: riderIcon }).addTo(map);
      riderMarker.bindPopup(`<b>${riderName}</b><br/>Speed: ${speed} km/h • EV Scooter`);
      riderMarkerRef.current = riderMarker;

      const routeLine = L.polyline(
        [
          [darkstoreLat, darkstoreLon],
          [riderLat, riderLon],
          [customerLat, customerLon]
        ],
        {
          color: '#3b82f6',
          weight: 4,
          opacity: 0.8,
          dashArray: '8, 8',
          lineCap: 'round'
        }
      ).addTo(map);
      routeLineRef.current = routeLine;

      mapInstanceRef.current = map;
    } catch (err) {
      console.warn('Leaflet map initialization error:', err);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (riderMarkerRef.current) {
      riderMarkerRef.current.setLatLng([riderLat, riderLon]);
    }
    if (routeLineRef.current) {
      routeLineRef.current.setLatLngs([
        [darkstoreLat, darkstoreLon],
        [riderLat, riderLon],
        [customerLat, customerLon]
      ]);
    }
    if (mapInstanceRef.current && isSimulating) {
      mapInstanceRef.current.panTo([riderLat, riderLon], { animate: true });
    }
  }, [riderLat, riderLon]);

  return (
    <div className="bg-white rounded-3xl p-4 shadow-xl border border-gray-100 space-y-3 font-sans relative overflow-hidden">
      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-extrabold text-gray-900 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            <span>Live GPS Telemetry (LocationIQ)</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-2.5 py-1 rounded-full font-extrabold text-[10px] transition-all flex items-center gap-1 cursor-pointer ${
              isSimulating ? 'bg-amber-400 text-black shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Play className={`w-3 h-3 ${isSimulating ? 'fill-black' : ''}`} />
            <span>{isSimulating ? 'Simulating...' : 'Simulate GPS'}</span>
          </button>
        </div>
      </div>

      <div className="relative w-full h-56 rounded-2xl overflow-hidden shadow-inner border border-gray-200">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        <div className="absolute top-2 left-2 z-20 bg-slate-950/85 backdrop-blur-md text-white p-2.5 rounded-xl text-[11px] font-mono shadow-lg border border-slate-800 space-y-1">
          <div className="flex items-center justify-between gap-3">
            <span className="text-amber-400 font-bold">Rider Speed:</span>
            <span className="font-bold">{speed} km/h</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-emerald-400 font-bold">Battery EV:</span>
            <span className="font-bold">⚡ {battery}%</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-blue-400 font-bold">Distance:</span>
            <span className="font-bold">{distanceRemaining} km</span>
          </div>
        </div>

        <div className="absolute bottom-2 right-2 z-20 bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-lg border border-emerald-400 flex items-center gap-1.5 animate-bounce">
          <Activity className="w-3.5 h-3.5 text-yellow-300" />
          <span>Arriving in ~{etaMinutes} Mins</span>
        </div>
      </div>

      <div className="flex justify-between items-center text-[11px] text-gray-500 pt-1">
        <span className="font-bold text-gray-700 truncate max-w-[240px]">
          📍 En route to: {displayAddress}
        </span>

        <a
          href={`https://maps.google.com/?q=${customerLat},${customerLon}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-600 font-extrabold hover:underline flex items-center gap-1 shrink-0"
        >
          <span>Open Maps</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
