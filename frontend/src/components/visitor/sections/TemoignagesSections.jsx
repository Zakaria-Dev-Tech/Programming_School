import { useEffect, useRef, useState } from 'react';
import { HiStar, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const temoignages = [
  { 
    name: "Aminata Ouédraogo", 
    role: "Développeuse Web", 
    text: "La formation m'a permis de trouver un emploi en 3 mois. Les formateurs sont excellents !", 
    avatar: "AO"
  },
  { 
    name: "Zakaria Nikiema", 
    role: "Étudiant", 
    text: "Programming School offre une formation de qualité à un prix accessible à tous. Je recommande vivement !", 
    avatar: "NZ"
  },
  { 
    name: "Fatoumata Sawadogo", 
    role: "Entrepreneuse", 
    text: "Grâce à la formation, je gère mon entreprise avec beaucoup plus d'efficacité. Un vrai tournant dans ma carrière.", 
    avatar: "FS"
  },
  {
    name: "Moussa Konaté",
    role: "Chef de projet IT",
    text: "L'approche pratique et les projets concrets m'ont permis d'acquérir une expérience solide rapidement.",
    avatar: "MK"
  },
  {
    name: "Mariam Diallo",
    role: "Data Analyst",
    text: "Une formation complète avec des formateurs à l'écoute. Les débouchés sont réels et nombreux.",
    avatar: "MD"
  }
];

const TemoignagesSections = () => {
  return (
    <section id="temoignages" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-5">
        
        {/* En-tête de section */}
        <div className="text-center mb-16">
          <span className="text-green-600 font-semibold text-sm uppercase tracking-wide">
            Témoignages
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
            Ce que disent nos apprenants
          </h2>
          <p className="text-gray-500 text-lg mt-4 max-w-2xl mx-auto">
            Plus de 2000 apprenants nous font confiance pour leur formation
          </p>
          <div className="w-20 h-0.5 bg-green-500 mx-auto mt-6 rounded-full" />
        </div>

        {/* Swiper pour les témoignages */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {temoignages.map((t, index) => (
            <SwiperSlide key={index}>
              <div className="group h-full">
                <div className="relative bg-white border border-gray-200 rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  
                  {/* Guillemet décoratif */}
                  <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg className="w-12 h-12 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  
                  {/* Étoiles de notation */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <HiStar key={i} className="w-4 h-4 text-amber-500 fill-current" />
                    ))}
                  </div>

                  {/* Texte du témoignage */}
                  <p className="text-gray-600 text-base leading-relaxed mb-8 relative z-10">
                    "{t.text}"
                  </p>

                  {/* Informations de l'auteur */}
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 text-base">
                        {t.name}
                      </div>
                      <div className="text-green-600 text-xs font-medium">
                        {t.role}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Section statistiques de satisfaction */}
        <div className="mt-20 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="group cursor-pointer">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                98%
              </div>
              <div className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">taux de satisfaction</div>
            </div>
            <div className="group cursor-pointer">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                2000+
              </div>
              <div className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">apprenants formés</div>
            </div>
            <div className="group cursor-pointer">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                85%
              </div>
              <div className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">d'insertion professionnelle</div>
            </div>
            <div className="group cursor-pointer">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                4.5/5
              </div>
              <div className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">note moyenne</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TemoignagesSections;