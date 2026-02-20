import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import { ArrowLeft, Save, Plus, Trash2, MapPin, Upload } from 'lucide-react';
import travelData from './data/travel-data.json';
import 'leaflet/dist/leaflet.css';

interface Photo {
    src: string;
    caption: string;
    autoGeo: boolean;
}

interface LocationData {
    id: string;
    name: string;
    country: string;
    coordinates: [number, number];
    date: string;
    coverImage: string;
    photos: Photo[];
    description: string;
    blogSlug: string | null;
    autoGeo: boolean;
}

const markerIcon = new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
            <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="#2DD4BF"/>
            <circle cx="12" cy="12" r="5" fill="#18181B"/>
        </svg>
    `),
    iconSize: [24, 36],
    iconAnchor: [12, 36],
});

// Click handler component for setting coordinates on map
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

function TravelAdmin() {
    const [locations, setLocations] = useState<LocationData[]>(travelData as LocationData[]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [saved, setSaved] = useState(false);
    const [pickingCoords, setPickingCoords] = useState(false);

    const editingLocation = editingIndex !== null ? locations[editingIndex] : null;

    const updateLocation = useCallback((index: number, updates: Partial<LocationData>) => {
        setLocations(prev => {
            const next = [...prev];
            next[index] = { ...next[index], ...updates };
            return next;
        });
        setSaved(false);
    }, []);

    const handleMapClick = useCallback((lat: number, lng: number) => {
        if (editingIndex !== null && pickingCoords) {
            updateLocation(editingIndex, { coordinates: [lat, lng], autoGeo: false });
            setPickingCoords(false);
        }
    }, [editingIndex, pickingCoords, updateLocation]);

    const addLocation = useCallback(() => {
        const newLoc: LocationData = {
            id: `new-location-${Date.now()}`,
            name: 'New Location',
            country: '',
            coordinates: [30, 104],
            date: new Date().toISOString().slice(0, 7),
            coverImage: '',
            photos: [],
            description: '',
            blogSlug: null,
            autoGeo: false,
        };
        setLocations(prev => [...prev, newLoc]);
        setEditingIndex(locations.length);
        setSaved(false);
    }, [locations.length]);

    const deleteLocation = useCallback((index: number) => {
        if (!confirm(`Delete "${locations[index].name}"?`)) return;
        setLocations(prev => prev.filter((_, i) => i !== index));
        setEditingIndex(null);
        setSaved(false);
    }, [locations]);

    const exportJSON = useCallback(() => {
        const json = JSON.stringify(locations, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'travel-data.json';
        a.click();
        URL.revokeObjectURL(url);
        setSaved(true);
    }, [locations]);

    const copyJSON = useCallback(() => {
        const json = JSON.stringify(locations, null, 2);
        navigator.clipboard.writeText(json).then(() => {
            setSaved(true);
            alert('JSON copied to clipboard!\n\nPaste into src/data/travel-data.json');
        });
    }, [locations]);

    return (
        <div className="min-h-screen bg-bg text-text font-sans">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link to="/travel" className="inline-flex items-center text-muted hover:text-primary mb-4 transition-colors">
                            <ArrowLeft size={16} className="mr-2" /> Back to Travel
                        </Link>
                        <h1 className="text-2xl font-bold font-mono text-primary">&gt; travel-data --edit</h1>
                        <p className="text-muted text-sm mt-1">Edit location info, set coordinates, then export JSON.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={addLocation}
                            className="px-4 py-2 bg-surface/50 text-text border border-border rounded hover:border-primary/50 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            <Plus size={16} /> Add Location
                        </button>
                        <button
                            onClick={copyJSON}
                            className="px-4 py-2 bg-primary/20 text-primary border border-primary/50 rounded hover:bg-primary/30 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            <Save size={16} /> Copy JSON
                        </button>
                        <button
                            onClick={exportJSON}
                            className="px-4 py-2 bg-primary text-bg rounded hover:bg-primary/80 transition-colors flex items-center gap-2 font-bold cursor-pointer"
                        >
                            <Upload size={16} /> Export JSON
                        </button>
                    </div>
                </div>

                {saved && (
                    <div className="mb-6 p-3 bg-green-900/30 border border-green-500/50 rounded text-green-400 text-sm font-mono">
                        ✅ Data exported! Paste into <code>src/data/travel-data.json</code> and commit.
                    </div>
                )}

                <div className="grid grid-cols-[320px_1fr] gap-6">
                    {/* Location List */}
                    <div className="space-y-2 max-h-[80vh] overflow-y-auto pr-2">
                        {locations.map((loc, index) => (
                            <button
                                key={loc.id}
                                onClick={() => { setEditingIndex(index); setPickingCoords(false); }}
                                className={`w-full text-left p-3 rounded border transition-all cursor-pointer ${editingIndex === index
                                    ? 'bg-primary/10 border-primary/50 text-primary'
                                    : 'bg-surface/20 border-border hover:border-primary/30'
                                    }`}
                            >
                                <div className="font-bold text-sm">{loc.name || loc.id}</div>
                                <div className="text-xs text-muted flex items-center gap-2 mt-1">
                                    <span>{loc.country || '—'}</span>
                                    <span>·</span>
                                    <span>{loc.date || '—'}</span>
                                    <span>·</span>
                                    <span>{loc.photos.length} photos</span>
                                </div>
                                {!loc.autoGeo && loc.coordinates[0] === 0 && loc.coordinates[1] === 0 && (
                                    <div className="text-xs text-yellow-500 mt-1">⚠ Coordinates not set</div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Edit Panel */}
                    {editingLocation ? (
                        <div className="space-y-6">
                            {/* Map for coordinate picking */}
                            <div className="rounded-lg overflow-hidden border border-border relative" style={{ height: '300px' }}>
                                <MapContainer
                                    center={editingLocation.coordinates[0] !== 0 ? editingLocation.coordinates : [30, 104]}
                                    zoom={editingLocation.coordinates[0] !== 0 ? 10 : 3}
                                    style={{ height: '100%', width: '100%' }}
                                    key={editingIndex}
                                >
                                    <TileLayer
                                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                    />
                                    <MapClickHandler onMapClick={handleMapClick} />
                                    {editingLocation.coordinates[0] !== 0 && (
                                        <Marker position={editingLocation.coordinates} icon={markerIcon} />
                                    )}
                                </MapContainer>
                                <button
                                    onClick={() => setPickingCoords(!pickingCoords)}
                                    className={`absolute top-3 right-3 z-[1000] px-3 py-1.5 rounded text-xs font-mono cursor-pointer ${pickingCoords
                                        ? 'bg-primary text-bg animate-pulse'
                                        : 'bg-bg/80 text-primary border border-primary/50 hover:bg-primary/20'
                                        }`}
                                >
                                    <MapPin size={12} className="inline mr-1" />
                                    {pickingCoords ? 'Click map to set...' : 'Pick coordinates'}
                                </button>
                            </div>

                            {/* Edit Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-muted mb-1 font-mono">ID</label>
                                    <input
                                        value={editingLocation.id}
                                        onChange={(e) => updateLocation(editingIndex!, { id: e.target.value })}
                                        className="w-full bg-surface/30 border border-border rounded px-3 py-2 text-sm font-mono focus:border-primary/50 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-muted mb-1 font-mono">Name</label>
                                    <input
                                        value={editingLocation.name}
                                        onChange={(e) => updateLocation(editingIndex!, { name: e.target.value })}
                                        className="w-full bg-surface/30 border border-border rounded px-3 py-2 text-sm font-mono focus:border-primary/50 outline-none"
                                        placeholder="东京 · Tokyo"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-muted mb-1 font-mono">Country</label>
                                    <input
                                        value={editingLocation.country}
                                        onChange={(e) => updateLocation(editingIndex!, { country: e.target.value })}
                                        className="w-full bg-surface/30 border border-border rounded px-3 py-2 text-sm font-mono focus:border-primary/50 outline-none"
                                        placeholder="日本"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-muted mb-1 font-mono">Date</label>
                                    <input
                                        value={editingLocation.date}
                                        onChange={(e) => updateLocation(editingIndex!, { date: e.target.value })}
                                        className="w-full bg-surface/30 border border-border rounded px-3 py-2 text-sm font-mono focus:border-primary/50 outline-none"
                                        placeholder="2023-10"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs text-muted mb-1 font-mono">Description</label>
                                    <textarea
                                        value={editingLocation.description}
                                        onChange={(e) => updateLocation(editingIndex!, { description: e.target.value })}
                                        className="w-full bg-surface/30 border border-border rounded px-3 py-2 text-sm font-mono focus:border-primary/50 outline-none resize-none h-20"
                                        placeholder="秋季东京之旅，从浅草到涩谷"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-muted mb-1 font-mono">Coordinates</label>
                                    <div className="flex gap-2">
                                        <input
                                            value={editingLocation.coordinates[0]}
                                            onChange={(e) => updateLocation(editingIndex!, {
                                                coordinates: [parseFloat(e.target.value) || 0, editingLocation.coordinates[1]]
                                            })}
                                            className="w-1/2 bg-surface/30 border border-border rounded px-3 py-2 text-sm font-mono focus:border-primary/50 outline-none"
                                            placeholder="lat"
                                            type="number"
                                            step="0.0001"
                                        />
                                        <input
                                            value={editingLocation.coordinates[1]}
                                            onChange={(e) => updateLocation(editingIndex!, {
                                                coordinates: [editingLocation.coordinates[0], parseFloat(e.target.value) || 0]
                                            })}
                                            className="w-1/2 bg-surface/30 border border-border rounded px-3 py-2 text-sm font-mono focus:border-primary/50 outline-none"
                                            placeholder="lng"
                                            type="number"
                                            step="0.0001"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs text-muted mb-1 font-mono">Blog Slug</label>
                                    <input
                                        value={editingLocation.blogSlug || ''}
                                        onChange={(e) => updateLocation(editingIndex!, { blogSlug: e.target.value || null })}
                                        className="w-full bg-surface/30 border border-border rounded px-3 py-2 text-sm font-mono focus:border-primary/50 outline-none"
                                        placeholder="tokyo-trip-2023 (optional)"
                                    />
                                </div>
                            </div>

                            {/* Photo list preview */}
                            <div>
                                <label className="block text-xs text-muted mb-2 font-mono">
                                    Photos ({editingLocation.photos.length})
                                    <span className="text-muted/50 ml-2">— managed by process-photos script</span>
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {editingLocation.photos.slice(0, 8).map((photo, i) => (
                                        <div key={i} className="aspect-square bg-surface/30 rounded border border-border overflow-hidden">
                                            <img
                                                src={photo.src}
                                                alt={photo.caption}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    ))}
                                    {editingLocation.photos.length > 8 && (
                                        <div className="aspect-square bg-surface/30 rounded border border-border flex items-center justify-center text-muted text-sm">
                                            +{editingLocation.photos.length - 8}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Delete button */}
                            <button
                                onClick={() => deleteLocation(editingIndex!)}
                                className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 cursor-pointer"
                            >
                                <Trash2 size={14} /> Delete this location
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-muted font-mono text-sm">
                            ← Select a location to edit
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TravelAdmin;
