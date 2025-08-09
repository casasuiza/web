import { useEffect, useState } from "react";
import EventCard from "./components/EventCard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PurchaseModal from "./components/purchase/PurchaseModal";
import foto from "../../assets/foto.png";

import { getEvents } from "../../api/events";
import type { EventData } from "../../api/events";

export default function Home() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para controlar modal y evento seleccionado
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await getEvents();

        // Filtrar eventos: solo mostrar aquellos cuya fecha es hoy o en el futuro
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filteredAndSortedEvents = data
          .filter(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate >= today;
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setEvents(filteredAndSortedEvents);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error al cargar eventos");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const handleBuyClick = (event: EventData) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  if (loading) return <p className="text-center mt-8">Cargando eventos...</p>;

  const dummyEvent: EventData = {
    id: "dummy-1",
    title: "Concierto de prueba",
    description: "Este es un evento de ejemplo porque aún no hay eventos.",
    location: "Casa Suiza, Buenos Aires",
    date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    capacity: 3,
    sold: 3,
    promo: true,
    soldOut: false,
    price: 0,
    imageUrl: foto,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    categoryId: "dummy-cat",
    organizerId: "dummy-org",
  };

  return (
    <>
      <Header />
      <main id="inicio" className="container mx-auto p-6">
        {events.length === 0 ? (
          <div>
            <p className="text-center mb-4">No hay eventos disponibles para mostrar.</p>
            <p className="text-center text-sm text-gray-500 mb-4">
              Este es un evento de ejemplo. El administrador está por crear uno real.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <EventCard
                key={dummyEvent.id}
                event={dummyEvent}
                onBuyClick={() => handleBuyClick(dummyEvent)}
              />
            </div>
            {error && <p className="text-center mt-8 text-red-600">{error}</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onBuyClick={() => handleBuyClick(event)}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />

      {/* Modal de compra */}
      {selectedEvent && (
        <PurchaseModal
          isOpen={true}
          eventId={selectedEvent.id!}
          eventTitle={selectedEvent.title}
          ticketPrice={selectedEvent.price}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
