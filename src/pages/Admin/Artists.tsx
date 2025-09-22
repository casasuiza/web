import React, { useState, useEffect } from 'react';
import { getArtists, deleteArtist, type Artist } from '../../api/artists';
import ArtistModal from './ArtistModal';
import ConfirmationModal from './components/ConfirmationModal';

const Artists: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState<Artist | null>(null);

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      const data = await getArtists();
      setArtists(data);
    } catch (error) {
      console.error('Error loading artists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (artist: Artist) => {
    setSelectedArtist(artist);
    setShowModal(true);
  };

  const handleDelete = (artist: Artist) => {
    setArtistToDelete(artist);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (artistToDelete) {
      try {
        await deleteArtist(artistToDelete.id);
        setArtists(artists.filter(a => a.id !== artistToDelete.id));
        setShowDeleteModal(false);
        setArtistToDelete(null);
      } catch (error) {
        console.error('Error deleting artist:', error);
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedArtist(null);
    loadArtists();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Artistas</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Agregar Artista
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Artista
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Género
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {artists.map((artist) => (
              <tr key={artist.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {artist.photo && (
                      <img className="h-10 w-10 rounded-full mr-4" src={artist.photo} alt={artist.name} />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{artist.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {artist.genre || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {artist.contact || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(artist)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(artist)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ArtistModal
          artist={selectedArtist}
          onClose={handleModalClose}
        />
      )}

      {showDeleteModal && (
        <ConfirmationModal
          title="Eliminar Artista"
          message={`¿Estás seguro de que quieres eliminar a ${artistToDelete?.name}?`}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default Artists;