import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Layers, 
  Search, 
  Sliders, 
  Star, 
  ShieldCheck, 
  Clock, 
  ChevronRight,
  Phone,
  MessageSquare,
  Sparkles,
  Zap,
  Info,
  Power,
  Shield,
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { User, HelpRequest } from '../../types';

export const LiveMapView: React.FC = () => {
  const { 
    users, 
    tasks, 
    currentUser, 
    t, 
    language, 
    setActiveTab, 
    setSelectedTaskForDetail, 
    acceptTask,
    toggleHelperMode,
    verifyTaskOTP,
    matchHelpersForTask,
    googleMapsApiKey,
    googleMapsConfigured
  } = useApp();
  
  const [selectedRadius, setSelectedRadius] = useState<number>(3); // 3 km
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedHelper, setSelectedHelper] = useState<User | null>(null);
  const [selectedTaskMarker, setSelectedTaskMarker] = useState<HelpRequest | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 11.0168, lng: 76.9558 }); // Coimbatore
  const [activeLayer, setActiveLayer] = useState<'all' | 'helpers' | 'requests'>('all');
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [matchingResults, setMatchingResults] = useState<any[] | null>(null);
  const [isMatching, setIsMatching] = useState(false);

  const googleMapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // Dynamic Google Maps Loader
  useEffect(() => {
    if (googleMapsConfigured && googleMapsApiKey) {
      loadGoogleMapsScript(googleMapsApiKey);
    }
  }, [googleMapsConfigured, googleMapsApiKey]);

  const loadGoogleMapsScript = (apiKey: string) => {
    if ((window as any).google && (window as any).google.maps) {
      setGoogleMapsLoaded(true);
      initGoogleMap();
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,routes`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGoogleMapsLoaded(true);
      initGoogleMap();
    };
    document.head.appendChild(script);
  };

  const initGoogleMap = () => {
    if (!googleMapRef.current || !(window as any).google) return;
    const google = (window as any).google;
    const map = new google.maps.Map(googleMapRef.current, {
      center: mapCenter,
      zoom: 14,
      styles: [
        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
      ]
    });
    mapInstanceRef.current = map;

    // Add user marker
    new google.maps.Marker({
      position: mapCenter,
      map: map,
      title: 'Your Location',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#FF6B2B',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
      }
    });
  };

  const handleVerifyOtp = async (taskId: string) => {
    if (!otpInput || otpInput.length < 4) {
      setOtpError('Please enter the 4-digit code.');
      return;
    }
    setOtpError(null);
    const res = await verifyTaskOTP(taskId, otpInput);
    if (res.success) {
      setOtpSuccess(true);
      setOtpInput('');
      setTimeout(() => setOtpSuccess(false), 3000);
    } else {
      setOtpError(res.error || 'Incorrect OTP code.');
    }
  };

  const handleSmartMatch = async () => {
    setIsMatching(true);
    try {
      const res = await matchHelpersForTask(currentUser.location, 'General', 'HIGH');
      setMatchingResults(res.rankedHelpers || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsMatching(false);
    }
  };

  const onlineHelpers = users.filter(u => u.isHelperModeOn && u.id !== currentUser.id);
  const openTasks = tasks.filter(t => t.state === 'PUBLISHED' || t.state === 'ACCEPTED' || t.state === 'STARTED' || t.state === 'IN_PROGRESS');
  const activeUserTask = tasks.find(t => 
    (t.requesterId === currentUser.id || t.helperId === currentUser.id) &&
    (t.state === 'ACCEPTED' || t.state === 'STARTED' || t.state === 'IN_PROGRESS')
  );

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-5 animate-in fade-in duration-200">
      {/* Left 65%: Interactive Map Container */}
      <div className="flex-1 lg:w-[65%] flex flex-col bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden relative">
        {/* Map Floating Control Header */}
        <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Radius & Layer Badges */}
          <div className="flex items-center gap-2 pointer-events-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md">
            <MapPin className="w-4 h-4 text-[#FF6B2B]" />
            <span className="text-xs font-bold text-slate-800 dark:text-white">Coimbatore Central</span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <select
              value={selectedRadius}
              onChange={(e) => setSelectedRadius(Number(e.target.value))}
              className="text-xs font-semibold bg-transparent text-slate-600 dark:text-slate-300 outline-none cursor-pointer"
            >
              <option value={1}>1 km radius</option>
              <option value={3}>3 km radius</option>
              <option value={5}>5 km radius</option>
              <option value={10}>10 km radius</option>
            </select>
          </div>

          {/* Quick Helper Mode Toggle in Map */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => toggleHelperMode()}
              className={`px-3 py-1.5 rounded-2xl text-xs font-bold shadow-md backdrop-blur-md border flex items-center gap-1.5 transition-all ${
                currentUser.isHelperModeOn
                  ? 'bg-teal-500 text-white border-teal-400'
                  : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>Helper Mode: {currentUser.isHelperModeOn ? 'ON (Ready)' : 'OFF'}</span>
            </button>

            {/* Smart Matching Trigger Button */}
            <button
              onClick={handleSmartMatch}
              className="px-3 py-1.5 rounded-2xl bg-[#FF6B2B] text-white text-xs font-bold shadow-md hover:bg-[#e05819] flex items-center gap-1 transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Smart Match</span>
            </button>
          </div>

          {/* Layer Filter Buttons */}
          <div className="flex items-center gap-1.5 pointer-events-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md">
            <button
              onClick={() => setActiveLayer('all')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                activeLayer === 'all'
                  ? 'bg-[#FF6B2B] text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveLayer('helpers')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                activeLayer === 'helpers'
                  ? 'bg-[#0BB8A8] text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Helpers ({onlineHelpers.length})
            </button>
            <button
              onClick={() => setActiveLayer('requests')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                activeLayer === 'requests'
                  ? 'bg-amber-500 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Tasks ({openTasks.length})
            </button>
          </div>
        </div>

        {/* Real Google Map or Vector Map Canvas */}
        <div className="flex-1 relative w-full h-full min-h-[420px] bg-[#E5E9F0] dark:bg-[#0D131F]">
          {googleMapsConfigured && googleMapsLoaded && (
            <div ref={googleMapRef} className="w-full h-full absolute inset-0 z-0" />
          )}

          {/* High-Fidelity Interactive Vector Map Graphic */}
          <div className="w-full h-full absolute inset-0 flex items-center justify-center overflow-hidden">
            <svg className="w-full h-full object-cover opacity-60 dark:opacity-40" viewBox="0 0 1000 700">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(156, 163, 175, 0.25)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="1000" height="700" fill="url(#grid)" />
              
              {/* Arterial Roads */}
              <path d="M 100 150 Q 400 300 900 250" fill="none" stroke="#CBD5E1" strokeWidth="14" strokeLinecap="round" />
              <path d="M 100 150 Q 400 300 900 250" fill="none" stroke="#F8FAFC" strokeWidth="8" strokeLinecap="round" />

              <path d="M 500 50 L 520 650" fill="none" stroke="#CBD5E1" strokeWidth="16" strokeLinecap="round" />
              <path d="M 500 50 L 520 650" fill="none" stroke="#F8FAFC" strokeWidth="10" strokeLinecap="round" />

              <path d="M 200 600 Q 520 350 850 550" fill="none" stroke="#CBD5E1" strokeWidth="12" />
              <path d="M 200 600 Q 520 350 850 550" fill="none" stroke="#F8FAFC" strokeWidth="6" />

              {/* Active Route Polyline (Helper to Task) */}
              {activeUserTask && (
                <path 
                  d="M 500 350 Q 550 280 620 280" 
                  fill="none" 
                  stroke="#0BB8A8" 
                  strokeWidth="5" 
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />
              )}
            </svg>

            {/* Current User Marker (Blue Dot 🔵) */}
            <div 
              className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: '50%', top: '50%' }}
            >
              <div className="relative flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 animate-ping absolute" />
                <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-xs text-white font-bold">
                  📍
                </div>
              </div>
              <div className="absolute top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
                You ({currentUser.name.split(' ')[0]})
              </div>
            </div>

            {/* Helper Markers (Green Dots 🟢) */}
            {(activeLayer === 'all' || activeLayer === 'helpers') && onlineHelpers.map((helper, idx) => {
              const offsets = [
                { x: '42%', y: '38%' }, // Kumar M.
                { x: '62%', y: '40%' }, // Priya S.
                { x: '58%', y: '65%' }, // Arjun R.
              ];
              const pos = offsets[idx % offsets.length];

              return (
                <div
                  key={helper.id}
                  onClick={() => {
                    setSelectedHelper(helper);
                    setSelectedTaskMarker(null);
                  }}
                  className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-125"
                  style={{ left: pos.x, top: pos.y }}
                >
                  <div className="relative flex flex-col items-center">
                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 p-0.5 shadow-xl border-2 border-[#0BB8A8] relative">
                      <img src={helper.avatar} alt={helper.name} className="w-full h-full rounded-xl object-cover" />
                      <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white ${
                        helper.helperStatus === 'available' ? 'bg-[#22C55E]' : 'bg-amber-400'
                      }`} />
                    </div>
                    <div className="mt-1 px-1.5 py-0.5 rounded-md bg-slate-900/90 text-white text-[10px] font-bold shadow whitespace-nowrap">
                      {helper.name.split(' ')[0]} ({helper.rating}★)
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Task Markers (Orange Pin 🆘) */}
            {(activeLayer === 'all' || activeLayer === 'requests') && openTasks.map((task, idx) => {
              const offsets = [
                { x: '52%', y: '42%' }, // Task 101
                { x: '35%', y: '55%' }, // Task 102
                { x: '68%', y: '32%' }, // Task 103
              ];
              const pos = offsets[idx % offsets.length];

              return (
                <div
                  key={task.id}
                  onClick={() => {
                    setSelectedTaskMarker(task);
                    setSelectedHelper(null);
                  }}
                  className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-125"
                  style={{ left: pos.x, top: pos.y }}
                >
                  <div className="relative flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#FF6B2B] text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-[#FF6B2B]/40 border-2 border-white">
                      🆘
                    </div>
                    <div className="mt-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-[#FF6B2B] font-extrabold text-[10px] shadow border border-[#FF6B2B]/30 whitespace-nowrap">
                      ₹{task.budget}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Live Task Banner / OTP Drawer */}
          {activeUserTask && (
            <div className="absolute top-16 left-4 right-4 bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-teal-500/40 z-30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold">
                    <Navigation className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
                        {activeUserTask.state}
                      </span>
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                        {activeUserTask.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Helper: {activeUserTask.helperName || 'Matching'} · ETA ~4 mins (0.8 km)
                    </p>
                  </div>
                </div>

                {/* Requester vs Helper Start OTP Display/Verification */}
                <div className="flex items-center gap-2">
                  {currentUser.id === activeUserTask.requesterId ? (
                    <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 text-center">
                      <span className="text-[10px] text-slate-500 block font-semibold">Start OTP (Share with Helper)</span>
                      <span className="text-base font-black tracking-widest text-[#FF6B2B]">{activeUserTask.startOtp || '4829'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Enter 4-digit OTP"
                        maxLength={4}
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        className="w-32 px-3 py-1.5 text-xs text-center font-mono font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                      />
                      <button
                        onClick={() => handleVerifyOtp(activeUserTask.id)}
                        className="px-3 py-1.5 rounded-xl bg-[#0BB8A8] text-white text-xs font-bold shadow-sm"
                      >
                        Verify & Start
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {otpError && <p className="text-[11px] text-red-500 mt-1">{otpError}</p>}
              {otpSuccess && <p className="text-[11px] text-emerald-500 mt-1 font-bold">OTP Verified! Task is now IN_PROGRESS.</p>}
            </div>
          )}

          {/* Selected Entity Popup Overlay */}
          {selectedHelper && (
            <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-200 dark:border-slate-700 z-30 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img src={selectedHelper.avatar} alt={selectedHelper.name} className="w-12 h-12 rounded-xl object-cover border" />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{selectedHelper.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">⭐ {selectedHelper.rating} ({selectedHelper.reviewCount} reviews)</p>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">🟢 {selectedHelper.helperStatus.toUpperCase()} · 0.4 km away</span>
                  </div>
                </div>
                <button onClick={() => setSelectedHelper(null)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
              </div>

              <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                {selectedHelper.skills.map((s, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTab('messages');
                  }}
                  className="flex-1 py-2 rounded-xl bg-[#0BB8A8] hover:bg-[#09998b] text-white font-bold text-xs transition"
                >
                  Direct Message
                </button>
                <button
                  onClick={() => setActiveTab('helpers')}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs"
                >
                  Profile
                </button>
              </div>
            </div>
          )}

          {selectedTaskMarker && (
            <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-200 dark:border-slate-700 z-30 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#FF6B2B]/10 text-[#FF6B2B] font-bold uppercase">
                    {selectedTaskMarker.category}
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">
                    {selectedTaskMarker.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedTaskMarker.location.address}</p>
                </div>
                <button onClick={() => setSelectedTaskMarker(null)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                <span className="text-base font-extrabold text-[#0BB8A8]">₹{selectedTaskMarker.budget}</span>
                {currentUser.isHelperModeOn && selectedTaskMarker.state === 'PUBLISHED' ? (
                  <button
                    onClick={() => acceptTask(selectedTaskMarker.id)}
                    className="px-4 py-2 bg-[#0BB8A8] hover:bg-[#09998b] text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    Accept Task
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedTaskForDetail(selectedTaskMarker);
                      setActiveTab('tasks');
                    }}
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl"
                  >
                    View Task Flow
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right 35%: Nearby Available Helpers Panel */}
      <div className="lg:w-[35%] bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Nearby Active Helpers
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Only showing helpers with <span className="font-bold text-[#0BB8A8]">Helper Mode = ON</span>
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{onlineHelpers.length} Online</span>
          </span>
        </div>

        {/* Smart Matching Results Section if present */}
        {matchingResults && (
          <div className="my-2 p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B2B]" />
                Top AI Matched Helper
              </span>
              <button onClick={() => setMatchingResults(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            {matchingResults[0] && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={matchingResults[0].helper.avatar} alt="" className="w-8 h-8 rounded-full" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{matchingResults[0].helper.name}</div>
                    <div className="text-[10px] text-slate-500">Score: {matchingResults[0].matchScore}/100 · {matchingResults[0].distanceKm} km</div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedHelper(matchingResults[0].helper)}
                  className="px-2.5 py-1 rounded-lg bg-[#FF6B2B] text-white font-bold text-[11px]"
                >
                  Select
                </button>
              </div>
            )}
          </div>
        )}

        {/* Helpers List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 py-2 space-y-2">
          {onlineHelpers.map((helper, idx) => {
            const distance = (0.4 + idx * 0.4).toFixed(1);
            const eta = Math.round(3 + idx * 2.5);

            return (
              <div 
                key={helper.id} 
                className="pt-3 pb-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 p-2.5 rounded-2xl transition cursor-pointer group"
                onClick={() => setSelectedHelper(helper)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <img
                        src={helper.avatar}
                        alt={helper.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-800 ${
                        helper.helperStatus === 'available' ? 'bg-[#22C55E]' : 'bg-amber-400'
                      }`} />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-[#FF6B2B] transition">
                          {helper.name}
                        </h4>
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="text-amber-500 font-bold flex items-center">
                          <Star className="w-3 h-3 fill-amber-400 inline mr-0.5" />
                          {helper.rating}
                        </span>
                        <span>·</span>
                        <span>{helper.skills[0] || 'General Help'}</span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#FF6B2B]" />
                          {distance} km away
                        </span>
                        <span className="flex items-center gap-1 text-[#0BB8A8] font-bold">
                          <Clock className="w-3 h-3" />
                          ETA {eta} min
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab('helpers');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#FF6B2B] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition self-center"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 -mx-5 -mb-5 p-4 rounded-b-3xl">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Google Maps & GPS Synchronized</span>
            <span className="font-bold text-[#0BB8A8]">Rapido Live Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
