import React, { useState } from 'react';
import { HiCalendar, HiLocationMarker, HiBadgeCheck } from 'react-icons/hi';

const CarteEvenement = ({ evenement }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const getBadgeColor = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-700',
      orange: 'bg-orange-100 text-orange-700',
      blue: 'bg-blue-100 text-blue-700'
    };
    return colors[color] || 'bg-gray-100 text-gray-700';
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className="relative h-[450px] cursor-pointer group perspective"
      onClick={handleCardClick}
    >
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* Face avant - Recto */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-full shadow-sm hover:shadow-md transition-shadow">
            {/* Image de couverture */}
            <div className="h-48 overflow-hidden">
              <img 
                src={evenement.couverture} 
                alt={evenement.titre}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Contenu */}
            <div className="p-5">
              {/* Badge */}
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor(evenement.badgeColor)}`}>
                {evenement.badge}
              </span>
              
              {/* Titre */}
              <h3 className="text-lg font-bold text-gray-800 mt-3 mb-2 line-clamp-1">
                {evenement.titre}
              </h3>
              
              {/* Date */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <HiCalendar className="w-4 h-4" />
                <span>{evenement.date}</span>
              </div>
              
              {/* Lieu */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <HiLocationMarker className="w-4 h-4" />
                <span>{evenement.lieu}</span>
              </div>
              
              {/* Résultat */}
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <HiBadgeCheck className="w-4 h-4 text-yellow-500 mt-0.5" />
                <span className="line-clamp-2">{evenement.resultat}</span>
              </div>
              
              {/* Indicateur de clic */}
              
            </div>
          </div>
        </div>
        
        {/* Face arrière - Verso (détails) */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-full shadow-sm p-5 flex flex-col">
            {/* Titre */}
            <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
              {evenement.titre}
            </h3>
            
            {/* Thème */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Thème</p>
              <p className="text-sm text-gray-700">{evenement.theme}</p>
            </div>
            
            {/* Description */}
            <div className="mb-3 flex-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Description</p>
              <p className="text-sm text-gray-600 leading-relaxed">{evenement.description}</p>
            </div>
            
            {/* Date et lieu */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Date & Lieu</p>
              <p className="text-sm text-gray-600">{evenement.date} • {evenement.lieu}</p>
            </div>
            
            {/* Résultat */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Résultat</p>
              <p className="text-sm text-gray-600">{evenement.resultat}</p>
            </div>
            
            {/* Indicateur */}
          
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default CarteEvenement;