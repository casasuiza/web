import { useState, useEffect } from 'react';
import { Clock, Calendar, MapPin, DollarSign, Users, Heart } from 'lucide-react';
import foto from '../../../assets/foto.png';
import type { EventData } from '../../../api/events';

interface EventCardProps {
  event: EventData;
  onBuyClick?: () => void;
}

// Función auxiliar para manejar localStorage
const LOCAL_STORAGE_KEY = 'favoriteEvents';

const getFavoriteEvents = (): string[] => {
  try {
    const storedFavorites = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  } catch (error) {
    console.error("Error al leer favoritos de localStorage:", error);
    return [];
  }
};

const saveFavoriteEvents = (favoriteIds: string[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favoriteIds));
  } catch (error) {
    console.error("Error al guardar favoritos en localStorage:", error);
  }
};

export default function EventCard({ event, onBuyClick }: EventCardProps) {

  const [isFavorite, setIsFavorite] = useState(() => {
    const favorites = getFavoriteEvents();
    return favorites.includes(event.id);
  });

  // Efecto para actualizar localStorage cuando isFavorite cambia
  useEffect(() => {
    const favorites = getFavoriteEvents();
    if (isFavorite) {
      if (!favorites.includes(event.id)) {
        saveFavoriteEvents([...favorites, event.id]);
      }
    } else {
      saveFavoriteEvents(favorites.filter(id => id !== event.id));
    }
  }, [isFavorite, event.id]);

  const displayImageUrl = event.imageUrl 
    ? `http://localhost:3000${event.imageUrl}` 
    : foto;
  const displayLocation = event.location || 'Casa Suiza, La Plata';
  const displayDescription = event.description || 'Sin descripción disponible.';

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    };
    return date.toLocaleDateString('es-ES', options);
  };

  const formatTime = (isoString?: string | null) => {
    if (!isoString) return "";
    try {
      return isoString.split('T')[1]?.substring(0, 5) || "";
    } catch (e) {
      console.error("Error formatting time for input:", isoString, e);
      return "";
    }
  };

  return (
    <div>
      <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
        <div className="relative overflow-hidden">
          <img
            src={displayImageUrl}
            alt={event.title}
            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {event.promo && (
            <div className="absolute top-3 left-3">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                🔥 PROMO
              </div>
            </div>
          )}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200"
          >
            <Heart
              className={`w-5 h-5 transition-colors duration-200 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </button>
        </div>

        <div className="p-5">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center bg-red-50 px-3 py-1 rounded-full">
              <Calendar className="w-4 h-4 mr-2 text-red-600" />
              <span className="text-sm font-medium text-red-600">{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center bg-red-50 px-3 py-1 rounded-full">
              <Clock className="h-4 text-red-600 mr-2" />
              <span className="text-sm font-medium text-red-600">{formatTime(event.date)}</span>
            </div>
          </div>

          <div className="flex items-center mb-3">
            <Users className="w-4 h-4 mr-2 text-gray-500" />
            <p className="text-gray-700 font-medium">{event.title}</p>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{displayLocation}</span>
            </div>
            {event.description && (
              <p className="text-gray-600 text-sm line-clamp-2">{displayDescription}</p>
            )}
            {event.capacity !== null && event.capacity !== undefined && (
              <div className="flex items-center text-gray-600 text-sm">
                <Users className="w-4 h-4 mr-2" />
                <span>Capacidad: {event.capacity}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1 text-green-600" />
              <span className="text-lg font-bold text-green-600">
                Desde ${event.price.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] ${event.soldOut
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl'
              }`}
            onClick={() => {
              if (!event.soldOut && onBuyClick) {
                onBuyClick();
              }
            }}
          >
            {event.soldOut ? '🚫 Agotado' : '🎫 Comprar Tickets'}
          </button>
        </div>
      </div>
    </div>
  );
}
