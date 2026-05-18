import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi'; // Plus besoin des icônes d'utilisateurs isolées

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Gère l'ouverture du menu burger

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fonction pour scroller vers une section et fermer le menu mobile
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false); 
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || isOpen ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="flex items-center justify-between px-6 md:px-8 py-4">
        
        {/* LOGO (Toujours visible) */}
        <div className="flex items-center z-50">
          <Link to="/" onClick={() => setIsOpen(false)}>
            <img src="/assets/logo-removebg-preview (1).png" alt="Pschool Logo" className="h-12 md:h-16" />
          </Link>
        </div>
        
        {/* MENU DESKTOP (Masqué sur mobile : hidden md:flex) */}
        <div className="hidden md:flex space-x-6 font-medium">
          {['hero', 'apropos', 'formations', 'services', 'evenements', 'contact', 'temoignages'].map((section) => (
            <button 
              key={section}
              onClick={() => scrollToSection(section)} 
              className={`transition cursor-pointer text-xl capitalize ${
                scrolled ? 'text-gray-700 hover:text-green-600' : 'text-white hover:text-green-400'
              }`}
            >
              {section === 'apropos' ? 'À propos' : section === 'evenements' ? 'Évènements' : section === 'temoignages' ? 'Témoignages' : section}
            </button>
          ))}
        </div>

        {/* ACTIONS & BURGER */}
        <div className="flex items-center z-50">
          {/* Boutons d'authentification - UNIQUEMENT SUR DESKTOP (hidden md:flex) */}
          <div className="hidden md:flex space-x-4">
            <Link to="/register" className="px-6 py-2 rounded-md font-bold transition bg-green-600 text-white hover:bg-green-700">
              Créer un compte
            </Link>
            <Link 
              to="/login"
              className={`px-6 py-2 rounded-md font-bold transition ${
                scrolled ? 'border border-gray-300 text-gray-600 hover:bg-gray-50' : 'border border-white/30 text-white hover:bg-white/10'
              }`}
            >
              Se connecter
            </Link>
          </div>

          {/* BOUTON HAMBURGER - UNIQUEMENT SUR MOBILE (md:hidden) */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 focus:outline-none transition-colors ${
              scrolled || isOpen ? 'text-gray-800' : 'text-white'
            }`}
          >
            {isOpen ? <HiX className="text-3xl" /> : <HiMenu className="text-3xl" />}
          </button>
        </div>
      </div>

      {/* RIDEAU MENU MOBILE (S'ouvre depuis la droite sur mobile) */}
      <div className={`md:hidden fixed inset-0 bg-white z-40 flex flex-col justify-between pt-24 pb-8 transition-transform duration-300 transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Liens de navigation au centre */}
        <div className="flex flex-col items-center space-y-5 font-semibold text-xl w-full px-8 overflow-y-auto">
          <button onClick={() => scrollToSection('hero')} className="text-gray-800 hover:text-green-600 py-2 border-b border-gray-100 w-full text-center">Accueil</button>
          <button onClick={() => scrollToSection('apropos')} className="text-gray-800 hover:text-green-600 py-2 border-b border-gray-100 w-full text-center">À propos</button>
          <button onClick={() => scrollToSection('formations')} className="text-gray-800 hover:text-green-600 py-2 border-b border-gray-100 w-full text-center">Formations</button>
          <button onClick={() => scrollToSection('services')} className="text-gray-800 hover:text-green-600 py-2 border-b border-gray-100 w-full text-center">Services</button>
          <button onClick={() => scrollToSection('evenements')} className="text-gray-800 hover:text-green-600 py-2 border-b border-gray-100 w-full text-center">Évènements</button>
          <button onClick={() => scrollToSection('contact')} className="text-gray-800 hover:text-green-600 py-2 border-b border-gray-100 w-full text-center">Contact</button>
          <button onClick={() => scrollToSection('temoignages')} className="text-gray-800 hover:text-green-600 py-2 border-b border-gray-100 w-full text-center">Témoignages</button>
        </div>

        {/* Boutons d'authentification calés TOUT EN BAS du menu mobile */}
        <div className="flex flex-col space-y-3 px-8 w-full">
          <Link 
            to="/login" 
            onClick={() => setIsOpen(false)}
            className="w-full text-center py-3 rounded-md font-bold text-gray-700 border border-gray-300 hover:bg-gray-50"
          >
            Se connecter
          </Link>
          <Link 
            to="/register" 
            onClick={() => setIsOpen(false)}
            className="w-full text-center py-3 rounded-md font-bold text-white bg-green-600 hover:bg-green-700"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;