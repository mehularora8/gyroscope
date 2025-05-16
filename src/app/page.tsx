'use client';

import { useState, useEffect } from 'react';
import { Place } from './api/gyros/route';

export default function Home() {
  const [places, setPlaces] = useState<Place[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [gyrosFound, setGyrosFound] = useState(false);
  const [permissionState, setPermissionState] = useState<PermissionState | null>(null);

  // Check for location permission status
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' })
        .then(permissionStatus => {
          setPermissionState(permissionStatus.state);
          
          // Listen for permission changes
          permissionStatus.onchange = () => {
            setPermissionState(permissionStatus.state);
          };
        })
        .catch(err => {
          console.error("Permission check error:", err);
        });
    }
  }, []);

  async function findGyros() {
    setBusy(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async pos => {
        try {
          const { latitude, longitude } = pos.coords;
          const r = await fetch(`/api/gyros?lat=${latitude}&lon=${longitude}`);
          if (!r.ok) throw new Error(await r.text());
          setPlaces(await r.json());
          setGyrosFound(true);
        } catch (err) {
          setError('Could not find gyros near you.');
          setGyrosFound(false);
          console.error("API error:", err);
        } finally {
          setBusy(false);
        }
      },
      err => { 
        console.error("Geolocation error:", err);
        setBusy(false);
        
        // Provide specific guidance based on error code
        if (err.code === 1) { // PERMISSION_DENIED
          setError('Location permission denied. Please enable location services in your device settings to find gyros near you.');
        } else if (err.code === 2) { // POSITION_UNAVAILABLE
          setError('Could not determine your location. Please check your device settings.');
        } else if (err.code === 3) { // TIMEOUT
          setError('Location request timed out. Please try again when you have a better connection.');
        } else {
          setError('Could not find gyros near you.');
        }
        
        setGyrosFound(false);
      },
      { enableHighAccuracy: true, timeout: 15_000 }
    );
  }

  function renderPermissionMessage() {
    if (permissionState === 'denied') {
      return (
        <div className="text-center mb-4 fade-in">
          <p className="text-red-600 mb-2">Location access is blocked</p>
          <p className="text-sm text-brown-dark">
            {navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad') ? 
              "Please enable location in Settings → Safari → Location" :
              "Please enable location access in your browser or device settings"}
          </p>
        </div>
      );
    }
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-xl flex flex-col items-center">
        {/* Initial state - larger centered elements */}
        <h1 className="text-5xl font-tenor-sans text-brown mb-3 tracking-wide fade-in">GYROSCOPE</h1>
        
        <p className="text-base text-brown-dark italic mb-8 text-center fade-in delay-100">
          Find authentic gyros near you 🌯
        </p>
        
        {gyrosFound && (
          <p className="text-base text-brown-dark mb-8 text-center fade-in">
            Found {places?.length} gyros near you.
          </p>
        )}
        
        {renderPermissionMessage()}
        
        {!gyrosFound && (
          <button
            onClick={findGyros}
            disabled={busy}
            className="rounded-md bg-brown px-8 py-4 text-beige-light font-tenor-sans tracking-wide hover:bg-brown-dark disabled:opacity-50 text-lg fade-in delay-200 hover:scale-105 hover:cursor-pointer transition-all duration-300 flex items-center justify-center gap-2"
          >
            {busy ? 'Locating ... ' : 'I\'m hungry'} 
            {!busy && <span className="text-lg arrow transition-transform duration-300">→</span>}
          </button>
        )}
        
        {error && <p className="text-red-600 mt-4 fade-in">{error}</p>}
        
        {/* Results - single column layout */}
        {places && (
          <div className="w-full mt-12 fade-in delay-300">
            <ul className="w-full flex flex-col gap-6">
              {places.map((p, index) => {
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${p.name} ${p.address}`
                )}`;
                
                const delayClass = `delay-${(index + 1) * 100}`;
                
                return (
                  <li key={p.id} className={`gyro-card rounded-xl p-6 shadow-md bg-beige-light/50 fade-in ${delayClass}`}>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block hover:no-underline"
                    >
                      <h3 className="text-2xl font-tenor-sans text-brown mb-2">{p.name}</h3>
                      <p className="text-base text-brown-dark mb-4">{p.address}</p>
                      <p className="text-base text-gold-dark font-medium flex justify-between items-center">
                        <span>{(p.distanceM / 1609).toFixed(2)} mi away</span>
                        <span className="text-lg arrow">→</span>
                      </p>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
