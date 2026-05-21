import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HiMenu, HiX, HiChevronDown } from 'react-icons/hi';


const Navbar = () => {

  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Variable pour savoir si on n'est pas sur la page d'accueil
  const isNotHome = location.pathname !== '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleScrollTo = (sectionId) => {
    setIsOpen(false);
    setShowDropdown(false);
    
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const section = document.getElementById(sectionId);
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Condition pour forcer le style sombre (texte noir)
  const isDarkText = scrolled || isNotHome;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isOpen || isNotHome ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="flex items-center justify-between px-6 md:px-8 py-4">
        
        {/* LOGO */}
        <div className="flex items-center z-50">
          <Link to="/" onClick={() => setIsOpen(false)}>
            <img src="/assets/logo-removebg-preview (1).png" alt="Pschool Logo" className="h-12 md:h-16" />
          </Link>
        </div>
        
        {/* MENU DESKTOP */}
        <div className="hidden md:flex items-center space-x-6 font-medium">
          <Link to="/" className={`text-xl transition hover:text-green-500 ${isDarkText ? 'text-gray-700' : 'text-white'}`}>Accueil</Link>
          <Link to="/a-propos" className={`text-xl transition hover:text-green-500 ${isDarkText ? 'text-gray-700' : 'text-white'}`}>À propos</Link>
          <Link to="/services" className={`text-xl transition hover:text-green-500 ${isDarkText ? 'text-gray-700' : 'text-white'}`}>Nos Services</Link>

          {/* DROPDOWN */}
          <div className="relative" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
            <button className={`flex items-center gap-1 text-xl transition hover:text-green-500 ${isDarkText ? 'text-gray-700' : 'text-white'}`}>
              Formations <HiChevronDown className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showDropdown && (
              <div className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-md py-2 border border-gray-100 text-gray-800">
                <Link to="/elearning" className="block px-4 py-3 hover:bg-green-50 hover:text-green-600 transition font-bold">E-learning</Link>
                <Link to="/formationSessions" className="block px-4 py-3 hover:bg-green-50 hover:text-green-600 transition font-bold">Sessions Programmées</Link>
              </div>
            )}
          </div>

          <button onClick={() => handleScrollTo('evenements')} className={`text-xl transition hover:text-green-500 ${isDarkText ? 'text-gray-700' : 'text-white'}`}>Évènements</button>
          <button onClick={() => handleScrollTo('temoignages')} className={`text-xl transition hover:text-green-500 ${isDarkText ? 'text-gray-700' : 'text-white'}`}>Témoignages</button>
          <button onClick={() => handleScrollTo('contact')} className={`text-xl transition hover:text-green-500 ${isDarkText ? 'text-gray-700' : 'text-white'}`}>Contact</button>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center z-50 space-x-4">
          <div className="hidden md:flex space-x-3">
            <Link to="/login" className={`px-5 py-2 rounded-md font-bold transition ${isDarkText ? 'border border-gray-300 text-gray-600' : 'border border-white/30 text-white'}`}>Se connecter</Link>
            <Link to="/register" className="px-5 py-2 bg-green-600 text-white rounded-md font-bold hover:bg-green-700 transition">S'inscrire</Link>
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className={`md:hidden p-2 ${isDarkText ? 'text-gray-800' : 'text-white'}`}>
            {isOpen ? <HiX className="text-3xl" /> : <HiMenu className="text-3xl" />}
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}
      <div className={`md:hidden fixed inset-0 bg-white z-40 flex flex-col pt-24 pb-10 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col items-center space-y-4 font-semibold text-xl px-8 overflow-y-auto">
          <Link to="/" onClick={() => setIsOpen(false)} className="w-full py-2 border-b">Accueil</Link>
          <Link to="/a-propos" onClick={() => setIsOpen(false)} className="w-full py-2 border-b">À propos</Link>
          <Link to="/elearning" onClick={() => setIsOpen(false)} className="w-full py-2 border-b text-green-600 italic">E-learning</Link>
          <button onClick={() => handleScrollTo('formations-programmees')} className="w-full py-2 border-b text-left">Sessions Programmées</button>
          <button onClick={() => handleScrollTo('evenements')} className="w-full py-2 border-b text-left">Évènements</button>
          <button onClick={() => handleScrollTo('temoignages')} className="w-full py-2 border-b text-left">Témoignages</button>
          <button onClick={() => handleScrollTo('contact')} className="w-full py-2 border-b text-left">Contact</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;