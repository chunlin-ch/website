import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import travelData from './data/travel-data.json';
import logo from './assets/logo.svg';

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

function TravelLocation() {
    const { locationId } = useParams();
    const location = (travelData as LocationData[]).find(loc => loc.id === locationId);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [locationId]);

    // Lightbox keyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (lightboxIndex === null || !location) return;
        if (e.key === 'Escape') setLightboxIndex(null);
        if (e.key === 'ArrowRight') setLightboxIndex((prev) => prev !== null ? Math.min(prev + 1, location.photos.length - 1) : 0);
        if (e.key === 'ArrowLeft') setLightboxIndex((prev) => prev !== null ? Math.max(prev - 1, 0) : 0);
    }, [lightboxIndex, location]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Disable body scroll when lightbox is open
    useEffect(() => {
        if (lightboxIndex !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [lightboxIndex]);

    if (!location) {
        return (
            <div className="min-h-screen bg-bg text-text flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Location not found</h1>
                    <Link to="/travel" className="text-primary hover:underline">Return to Travel</Link>
                </div>
            </div>
        );
    }

    // Prevent right-click and drag on images (anti-download protection)
    const protectedImageProps = {
        onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
        onDragStart: (e: React.DragEvent) => e.preventDefault(),
        draggable: false,
    };

    return (
        <div className="min-h-screen bg-bg text-text font-sans">
            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Header */}
                <Link to="/travel" className="inline-flex items-center text-muted hover:text-primary mb-8 transition-colors group">
                    <ArrowLeft size={16} className="mr-3 group-hover:-translate-x-1 transition-transform" />
                    <img src={logo} alt="Chunlin.ch" className="h-[28px] md:h-[32px]" />
                </Link>

                <header className="mb-12 pb-8 border-b border-border">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight text-white">{location.name}</h1>
                    <div className="flex flex-wrap gap-4 text-sm text-muted font-mono">
                        <span className="flex items-center gap-1"><MapPin size={14} />{location.country}</span>
                        <span className="flex items-center gap-1"><Calendar size={14} />{location.date}</span>
                        <span className="flex items-center gap-1"><ImageIcon size={14} />{location.photos.length} photos</span>
                    </div>
                    <p className="text-muted mt-4 text-lg">{location.description}</p>
                    {location.blogSlug && (
                        <Link to={`/blog/${location.blogSlug}`} className="inline-flex items-center gap-1 mt-4 text-primary hover:underline text-sm">
                            <ExternalLink size={14} /> Read related article
                        </Link>
                    )}
                </header>

                {/* Photo Gallery Grid - with anti-download protection overlay */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {location.photos.map((photo, index) => (
                        <button
                            key={index}
                            onClick={() => setLightboxIndex(index)}
                            className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-surface border border-border hover:border-primary/50 transition-all cursor-pointer"
                        >
                            {/* The actual image */}
                            <img
                                src={photo.src}
                                alt={photo.caption}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
                                loading="lazy"
                                {...protectedImageProps}
                            />
                            {/* Anti-download transparent overlay */}
                            <div className="absolute inset-0 bg-transparent" {...protectedImageProps} />
                            {/* Hover caption */}
                            <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                    <p className="text-sm text-white font-medium">{photo.caption}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Lightbox */}
                {lightboxIndex !== null && (
                    <div
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                        onClick={() => setLightboxIndex(null)}
                    >
                        {/* Close hint */}
                        <div className="absolute top-4 right-4 text-white/60 text-sm font-mono z-50">
                            ESC / Click to close · ← → Navigate
                        </div>

                        {/* Counter */}
                        <div className="absolute top-4 left-4 text-white/60 text-sm font-mono z-50">
                            {lightboxIndex + 1} / {location.photos.length}
                        </div>

                        {/* Navigation buttons */}
                        {lightboxIndex > 0 && (
                            <button
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/60 hover:text-white text-3xl transition-colors z-50 cursor-pointer"
                                onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
                            >
                                ‹
                            </button>
                        )}
                        {lightboxIndex < location.photos.length - 1 && (
                            <button
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/60 hover:text-white text-3xl transition-colors z-50 cursor-pointer"
                                onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
                            >
                                ›
                            </button>
                        )}

                        {/* Image */}
                        <div className="max-w-[90vw] max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                            <img
                                src={location.photos[lightboxIndex].src}
                                alt={location.photos[lightboxIndex].caption}
                                className="max-w-full max-h-[75vh] object-contain select-none"
                                {...protectedImageProps}
                            />
                            {/* Anti-download overlay on lightbox image */}
                            <div className="absolute inset-0 bg-transparent" {...protectedImageProps} />
                            <p className="text-white/80 mt-4 text-sm font-mono">
                                {location.photos[lightboxIndex].caption}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TravelLocation;
