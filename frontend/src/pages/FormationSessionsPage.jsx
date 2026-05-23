import { useState, useEffect } from 'react';
import api from '../services/api'; 
import { useNavigate } from 'react-router-dom';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { HiArrowNarrowRight, HiOutlineAcademicCap } from 'react-icons/hi';

const FormationSessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/800x1000?text=Affiche+P.School';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://127.0.0.1:8000/storage/${imagePath.replace('storage/', '')}`;
  };

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await api.get('/formations?mode=vitrine&mode_formation=session');
        setSessions(data || []);
      } catch (error) {
        console.error("Erreur sessions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  return (
    <section id="formations-programmees" className="py-20 pt-32 pb-16 bg-white scroll-mt-10">
      <div className="max-w-6xl mx-auto px-5">
        
        <div className="text-center mb-12">
          <span className="text-green-500 font-semibold text-sm uppercase tracking-wide">Prochaines Sessions</span>
          <p className="text-2xl font-bold text-gray-800 mt-2">Réservez votre place pour nos formations intensives en présentiel</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">Possibilité de suivre en ligne</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
          </div>
        ) : sessions.length > 0 ? (
          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={true}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-14"
          >
            {sessions.map(session => (
              <SwiperSlide key={session.id}>
                <div className="group relative overflow-hidden rounded-xl shadow-lg bg-white transition-all duration-300 hover:shadow-xl">
                  <img 
                    src={getImageUrl(session.image)} 
                    alt={session.titre} 
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay au survol */}
                  <div className="absolute inset-0 bg-gray-900/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center p-6 text-center">
                    <h3 className="text-white text-xl font-bold mb-2 uppercase tracking-tighter">{session.titre}</h3>
                    <p className="text-green-500 font-black mb-4 uppercase text-xs">{session.duree}</p>
                    
                    <div className="flex flex-col gap-3 w-full">
                      <button 
                        onClick={() => navigate(`/inscription-session/${session.id}`)}
                        className="bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold text-xs hover:bg-green-500 hover:text-white transition-colors"
                      >
                        Inscription Enfant (-18 ans)
                      </button>
                      <button 
                        onClick={() => navigate(`/inscription-session-adulte/${session.id}`)}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold text-xs hover:bg-green-700 transition-colors"
                      >
                        Inscription Adulte (+18 ans)
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Aucune session programmée</p>
          </div>
        )}

        {/* BOUTON AJOUTÉ EN BAS */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <button 
            onClick={() => window.location.href = '/elearning'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
          >
            <span>Découvrir nos formations E-learning</span>
            <HiArrowNarrowRight className="w-4 h-4" />
          </button>
          <p className="text-gray-400 text-xs mt-3">
            Apprenez à votre rythme, où que vous soyez
          </p>
        </div>

      </div>
    </section>
  );
};

export default FormationSessionsPage;