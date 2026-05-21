import { useEffect, useRef } from 'react';
import { HiOutlineArrowNarrowRight, HiOutlinePlay } from 'react-icons/hi';

const HeroSection = () => {
  const statsRef = useRef([]);

  useEffect(() => {
    // Animation des compteurs
    const animateValue = (element, start, end, duration) => {
      const step = (end - start) / (duration / 16);
      let current = start;
      const timer = setInterval(() => {
        current += step;
        if (current >= end) {
          current = end;
          clearInterval(timer);
        }
        if (element) element.textContent = Math.floor(current) + (element.dataset.suffix || '');
      }, 16);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const value = entry.target.dataset.value;
          const suffix = entry.target.dataset.suffix;
          animateValue(entry.target, 0, parseInt(value), 1500);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsRef.current.forEach(stat => {
      if (stat) observer.observe(stat);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-start overflow-hidden">
      {/* Background avec parallax */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed transform scale-105" 
        style={{ backgroundImage: "url('/assets/hero-bg.jpg')" }}
      />
      
      {/* Overlay gradient dynamique */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
      
      {/* Effet de particules (cercles flous) */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* STATISTIQUES DÉPLACÉES EN HAUT À DROITE */}
      <div className="absolute top-24 right-6 md:top-32 md:right-12 z-20">
        <div className="grid grid-cols-3 gap-4 md:gap-6 bg-black/30 backdrop-blur-sm rounded-2xl p-3 md:p-4 border border-white/10">
          {[
            { value: "2000", suffix: "+", label: "Apprenants formés", sub: "depuis 2021" },
            { value: "50", suffix: "+", label: "Formations", sub: "disponibles" },
            { value: "90", suffix: "%+", label: "Taux de satisfaction", sub: "recommandé" }
          ].map((stat, idx) => (
            <div key={idx} className="text-center group cursor-pointer">
              <div className="relative">
                <div 
                  ref={el => statsRef.current[idx] = el}
                  data-value={stat.value}
                  data-suffix={stat.suffix}
                  className="text-2xl md:text-3xl font-black bg-gradient-to-r from-green-500 to-green-500 bg-clip-text text-transparent"
                >
                  0{stat.suffix}
                </div>
                <div className="absolute -bottom-2 left-1/2 w-0 h-0.5 bg-gradient-to-r from-green-500 to-transparent group-hover:w-1/2 transition-all duration-500 -translate-x-1/2" />
              </div>
              <div className="text-[10px] md:text-xs font-semibold text-gray-300 mt-1 md:mt-2">{stat.label}</div>
              <div className="text-[8px] text-gray-400">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 px-6 md:px-20 max-w-4xl">
        
        {/* Titre avec animation */}
        <h2 className="text-5xl md:text-7xl font-black leading-tight animate-fade-up">
          <span className="text-green-500">
            "Devenir Programmeur
          </span>
          <br />
          <span className="text-white">En un clin d'œil"</span>
        </h2>
        
        {/* Description */}
        <div className="mt-6 space-y-2 animate-fade-up animation-delay-200">
          <p className="text-xl md:text-2xl text-gray-200 font-light">
            Maîtriser l'avenir du numérique au Burkina Faso
          </p>
          <p className="text-lg text-gray-300">
            Apprenez le Code, la Robotique et le Numérique avec <span className='text-green-500'>PSchool</span>
          </p>
        </div>
        
        {/* Boutons avec effets */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10 animate-fade-up animation-delay-400">
          <button 
           onClick={() => window.location.href = '/formationSessions'}
            className="px-5 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition"
          >
            <span className="relative z-10 flex items-center gap-2">
              Découvrir nos offres de formations intensives
              <HiOutlineArrowNarrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          <button 
          onClick={() => window.location.href = '/services'}
            className="group px-8 py-4 border-2 border-white/30 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white hover:text-green-600 transition-all duration-300 hover:border-transparent hover:shadow-xl"
          >
            <span className="flex items-center gap-2">
              <HiOutlinePlay className="w-5 h-5" />
              Nos Prestations de services
            </span>
          </button>
        </div>
        
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-green-500 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;