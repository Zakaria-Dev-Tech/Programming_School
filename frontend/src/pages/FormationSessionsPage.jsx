import { useState, useEffect } from 'react';
import api from '../services/api'; 
import { useNavigate } from 'react-router-dom';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { HiArrowNarrowRight, HiOutlineUserGroup, HiOutlineDesktopComputer } from 'react-icons/hi';

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
    <section id="formations-programmees" className="scroll-mt-10 bg-slate-50 min-h-screen">

      {/* Hero header — vert émeraude pour distinguer de l'e-learning bleu */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-900 to-blue-900 pt-36 pb-20 px-5 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-52 h-52 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5  text-white text-3xl font-semibold uppercase  mb-5 ">
      
            Sessions Intensives
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
            Prochaines Sessions de Formation
          </h1>
          <p className="text-emerald-100 text-sm md:text-base max-w-xl mx-auto">
            Réservez votre place pour nos formations intensives en présentiel.<br className="hidden md:block" />
            Possibilité de suivre en ligne.
          </p>

          {/* Badges info */}
          <div className="flex items-center justify-center gap-4 mt-7 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5  text-white text-3xl  ">
              <HiOutlineUserGroup className="w-8 h-8" />
              Présentiel & En ligne
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5  text-white text-3xl ">
              <HiOutlineDesktopComputer className="w-8 h-8" />
              Formations intensives
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 pb-20">

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-[3px] border-gray-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-gray-400 text-sm">Chargement des sessions...</p>
          </div>
        ) : sessions.length > 0 ? (
          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            spaceBetween={24}
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
                <div className="group relative overflow-hidden rounded-2xl shadow-md bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <img
                    src={getImageUrl(session.image)}
                    alt={session.titre}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Overlay au survol */}
                  <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center p-6 text-center">
                    <h3 className="text-white text-xl font-bold mb-2 uppercase tracking-tight leading-snug">
                      {session.titre}
                    </h3>
                    <p className="text-emerald-400 font-bold mb-6 uppercase text-xs tracking-wider">
                      {session.duree}
                    </p>

                    <div className="flex flex-col gap-3 w-full">
                      <button
                        onClick={() => navigate(`/inscription-session/${session.id}`)}
                        className="bg-white text-gray-900 px-6 py-2.5 rounded-xl font-semibold text-xs hover:bg-emerald-500 hover:text-white transition-colors"
                      >
                        Inscription Enfant (-18 ans)
                      </button>
                      <button
                        onClick={() => navigate(`/inscription-session-adulte/${session.id}`)}
                        className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold text-xs hover:bg-emerald-700 transition-colors"
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
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-300 font-bold uppercase text-[10px] tracking-widest">
              Aucune session programmée pour le moment
            </p>
          </div>
        )}

        {/* CTA e-learning */}
        <div className="mt-12 pt-10 border-t border-gray-200 text-center">
          <p className="text-gray-400 text-sm mb-4">Préférez-vous apprendre à votre propre rythme ?</p>
          <button
            onClick={() => window.location.href = '/elearning'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors shadow-sm shadow-blue-100"
          >
            <span>Découvrir nos formations E-learning</span>
            <HiArrowNarrowRight className="w-4 h-4" />
          </button>
          <p className="text-gray-400 text-xs mt-3">Apprenez où que vous soyez, à votre rythme</p>
        </div>

      </div>
    </section>
  );
};

export default FormationSessionsPage;