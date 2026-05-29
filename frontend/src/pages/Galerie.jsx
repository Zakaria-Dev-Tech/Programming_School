import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { HiX, HiArrowLeft } from 'react-icons/hi';
import { evenements, photosGalerie } from '../data/evenements';

const Galerie = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const eventId = searchParams.get('event');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const photosFiltrees = eventId
    ? photosGalerie.filter(photo => photo.evenementId === parseInt(eventId))
    : photosGalerie;

  const evenementFiltre = eventId
    ? evenements.find(e => e.id === parseInt(eventId))
    : null;

  return (
    <div className="min-h-screen pt-28 bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-5">
      <div className="max-w-7xl mx-auto">
        
        {/* Bouton retour stylisé */}
        <button 
          onClick={() => navigate('/evenements')} 
          className="group flex items-center gap-2 text-gray-500 hover:text-green-600 mb-6 transition-all duration-300 hover:translate-x-[-4px]"
        >
          <HiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Retour aux événements</span>
        </button>
        
        {/* En-tête avec animation */}
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {evenementFiltre ? `Galerie - ${evenementFiltre.titre}` : 'Galerie photo'}
          </h1>
          <p className="text-gray-500 mt-3 text-lg">
            {evenementFiltre 
              ? `Découvrez les moments forts de ${evenementFiltre.titre}`
              : 'Tous les moments forts de P.School en images'}
          </p>
      
        </div>

        {/* Compteur de photos */}
        <div className="flex justify-between items-center mb-8">
         
          {evenementFiltre && (
            <div className="text-sm text-gray-400">
              {evenementFiltre.date}
            </div>
          )}
        </div>

        {/* Grille de photos - 3 colonnes */}
        {photosFiltrees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-6">
            {photosFiltrees.map((photo, index) => (
              <div
                key={photo.id}
                className="group relative rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in-up cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedPhoto(photo)}
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={photo.url}
                    alt={photo.titre}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                </div>
                
                {/* Overlay au survol - simplifié */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end p-5">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-base font-semibold">{photo.titre}</p>
                    <p className="text-white/70 text-xs mt-1">
                      {evenementFiltre?.titre || 'P.School'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 mt-8 shadow-sm">
            <div className="text-6xl mb-4"></div>
            <p className="text-gray-400 font-medium">Aucune photo disponible pour cet événement</p>
            <button 
              onClick={() => navigate('/evenements')}
              className="mt-4 text-green-600 hover:text-green-700 text-sm font-medium"
            >
              ← Retour aux événements
            </button>
          </div>
        )}

        {/* Modal pour agrandir la photo - simplifié */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in">
            {/* Fond flou */}
            <div className="absolute inset-0 backdrop-blur-md"></div>
            
            {/* Contenu modal */}
            <div className="relative z-10 max-w-6xl w-full">
              <button 
                onClick={() => setSelectedPhoto(null)} 
                className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
              >
                <HiX className="w-8 h-8" />
              </button>
              
              <div className="bg-transparent rounded-2xl overflow-hidden">
                <img 
                  src={selectedPhoto.url} 
                  alt={selectedPhoto.titre} 
                  className="w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" 
                />
              </div>
              
              {/* Informations sous la photo */}
              <div className="mt-4 text-center text-white">
                <p className="text-lg font-semibold">{selectedPhoto.titre}</p>
                <p className="text-sm text-white/60 mt-1">
                  {evenementFiltre?.titre || 'Programming School'} • {evenementFiltre?.date || 'P.School'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Styles d'animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Galerie;