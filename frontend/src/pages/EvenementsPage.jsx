import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';
import { evenements, photosGalerie } from '../data/evenements';
import CarteEvenement from '../components/CarteEvenement';

const EvenementsPage = () => {
  const navigate = useNavigate();

  const handleVoirTouteLaGalerie = () => {
    navigate('/galerie');
  };

  // Trier du plus récent au plus ancien
  const evenementsTries = [...evenements].sort((a, b) => {
    const anneeA = parseInt(a.date.split(' ').pop());
    const anneeB = parseInt(b.date.split(' ').pop());
    return anneeB - anneeA;
  });

  return (
    <div className="min-h-screen pt-28 bg-gray-50 py-12 px-5">
      <div className="max-w-6xl mx-auto">
        
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Événements passés
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Cliquez sur une carte pour découvrir les détails
          </p>
          <div className="w-16 h-0.5 bg-gray-300 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Bouton vers galerie complète */}
        <div className="flex justify-end mb-8">
          <button
            onClick={handleVoirTouteLaGalerie}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Voir toute la galerie
            <HiArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Grille des événements */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {evenementsTries.map((evenement) => (
            <CarteEvenement
              key={evenement.id}
              evenement={evenement}
            />
          ))}
        </div>

        {/* Section galerie aperçu */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 text-center mb-6">
            Derniers souvenirs
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {photosGalerie.slice(0, 4).map((photo, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img 
                  src={photo.url}
                  alt={`Souvenir ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={handleVoirTouteLaGalerie}
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <button
              onClick={handleVoirTouteLaGalerie}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Voir plus de photos
              <HiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvenementsPage;