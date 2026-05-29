import React from 'react';
import { HiCalendar, HiLocationMarker, HiX } from 'react-icons/hi';

const ModalDescription = ({ evenement, onClose, onVoirPhotos }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        {/* En-tête */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">{evenement.titre}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <HiX className="w-6 h-6" />
          </button>
        </div>
        
        {/* Contenu */}
        <div className="p-6 space-y-4">
          {/* Image */}
          <img 
            src={evenement.couverture} 
            alt={evenement.titre} 
            className="w-full h-64 object-cover rounded-lg" 
          />
          
          {/* Date et lieu */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <HiCalendar className="w-4 h-4" />
              <span>{evenement.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <HiLocationMarker className="w-4 h-4" />
              <span>{evenement.lieu}</span>
            </div>
          </div>
          
          {/* Description */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">À propos</h4>
            <p className="text-gray-600 leading-relaxed">{evenement.description}</p>
          </div>
          
          {/* Thème */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Thème</h4>
            <p className="text-gray-600">{evenement.theme}</p>
          </div>
          
          {/* Résultat */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Résultat / Distinction</h4>
            <p className="text-gray-600">{evenement.resultat}</p>
          </div>
          
          {/* Bouton photos */}
          <button
            onClick={() => {
              onClose();
              onVoirPhotos(evenement);
            }}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Voir toutes les photos
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDescription;