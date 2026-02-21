import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { ArrowLeft, MapPin, Calendar, Image } from 'lucide-react';
import travelData from './data/travel-data.json';
import logo from './assets/logo.svg';
import 'leaflet/dist/leaflet.css';

// Custom marker icon (teal colored pin)
const customIcon = new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
            <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="#2DD4BF"/>
            <circle cx="12" cy="12" r="5" fill="#18181B"/>
        </svg>
    `),
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
});

interface TravelLocation {
    id: string;
    name: string;
    country: string;
    coordinates: [number, number];
    date: string;
    coverImage: string;
    photos: { src: string; caption: string; autoGeo: boolean }[];
    description: string;
    blogSlug: string | null;
    autoGeo: boolean;
}

function Travel() {
    const locations = travelData as TravelLocation[];

    // Calculate map center from all locations
    const avgLat = locations.reduce((sum, loc) => sum + loc.coordinates[0], 0) / locations.length;
    const avgLng = locations.reduce((sum, loc) => sum + loc.coordinates[1], 0) / locations.length;

    return (
        <div className="min-h-screen bg-bg text-text font-sans">
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-12">
                    <Link to="/" className="inline-flex items-center text-muted hover:text-primary mb-6 transition-colors group">
                        <ArrowLeft size={16} className="mr-3 group-hover:-translate-x-1 transition-transform" />
                        <img src={logo} alt="Chunlin.ch" className="h-[28px] md:h-[32px]" />
                    </Link>
                    <h1 className="text-xs font-bold tracking-widest text-primary uppercase font-mono mb-4">&gt; ls ~/travel</h1>
                    <p className="text-muted font-mono text-sm">
                        <span className="text-secondary">{locations.length}</span> locations · <span className="text-secondary">{locations.reduce((sum, loc) => sum + loc.photos.length, 0)}</span> photos
                    </p>
                </div>

                {/* Interactive Map */}
                <div className="mb-12 rounded-lg overflow-hidden border border-border shadow-lg" style={{ height: '450px' }}>
                    <MapContainer
                        center={[avgLat, avgLng]}
                        zoom={3}
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />
                        {locations.map((location) => (
                            <Marker
                                key={location.id}
                                position={location.coordinates}
                                icon={customIcon}
                            >
                                <Popup className="travel-popup">
                                    <Link to={`/travel/${location.id}`} className="block no-underline">
                                        <div className="bg-bg rounded-lg overflow-hidden" style={{ width: '220px' }}>
                                            <div
                                                className="h-32 bg-surface bg-cover bg-center"
                                                style={{
                                                    backgroundImage: `url(${location.coverImage})`,
                                                    backgroundColor: '#27272A',
                                                }}
                                            />
                                            <div className="p-3">
                                                <h3 className="font-bold text-text text-sm mb-1">{location.name}</h3>
                                                <div className="flex items-center gap-2 text-xs text-muted">
                                                    <span className="flex items-center gap-1"><Calendar size={10} />{location.date}</span>
                                                    <span className="flex items-center gap-1"><Image size={10} />{location.photos.length}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                {/* Location Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {locations.map((location) => (
                        <Link
                            key={location.id}
                            to={`/travel/${location.id}`}
                            className="group block rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all bg-surface/20 hover:bg-surface/40"
                        >
                            {/* Cover Image */}
                            <div
                                className="h-48 bg-surface bg-cover bg-center relative overflow-hidden"
                                style={{
                                    backgroundImage: `url(${location.coverImage})`,
                                    backgroundColor: '#27272A',
                                }}
                            >
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" />
                                {/* Location badge */}
                                <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-mono text-primary bg-bg/60 backdrop-blur-sm px-2 py-1 rounded">
                                    <MapPin size={12} />
                                    {location.country}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <h3 className="font-bold text-text group-hover:text-primary transition-colors mb-1">{location.name}</h3>
                                <p className="text-xs text-muted mb-3 line-clamp-2">{location.description}</p>
                                <div className="flex items-center justify-between text-xs font-mono text-muted">
                                    <span className="flex items-center gap-1"><Calendar size={12} />{location.date}</span>
                                    <span className="flex items-center gap-1"><Image size={12} />{location.photos.length} photos</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Travel;
