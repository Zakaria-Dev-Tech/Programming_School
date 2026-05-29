import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HiMenu, HiX, HiChevronDown } from 'react-icons/hi';
import { useAuth } from '../../contexts/AuthContext'; 

const Navbar = () => {

  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
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

  const isDarkText = scrolled || isOpen || isNotHome;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isOpen || isNotHome ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="flex items-center justify-between px-6 md:px-8 py-3">
        
        {/* LOGO */}
        <Link to="/" onClick={() => setIsOpen(false)} className="flex-shrink-0 z-50">
          <img src="/assets/logo-removebg-preview (1).png" alt="Pschool Logo" className="h-10 md:h-12" />
        </Link>
        
        {/* MENU DESKTOP */}
        <div className="hidden md:flex items-center space-x-6 font-medium">
          <Link to="/" className={`transition hover:text-orange-500 ${isDarkText ? 'text-gray-700' : 'text-white'}`}>Accueil</Link>
          <Link to="/a-propos" className={`transition hover:text-orange-500 ${isDarkText ? 'text-gray-700' : 'text-white'}`}>À propos</Link>
          <Link to="/services" className={`transition hover:text-orange-500 ${isDarkText ? 'text-gray-700' : 'text-white'}`}>Nos Services</Link>

          {/* DROPDOWN */}
          <div className="relative" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
            <button className={`flex items-center gap-1 transition hover:text-orange-500 ${isDarkText ? 'text-gray-700' : 'text-white'}`}>
              Formations <HiChevronDown className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showDropdown && (
              <div className="absolute top-full left-0 w-56 bg-white shadow-lg rounded-md py-2 border border-gray-100">
                <Link to="/elearning" className="block px-4 py-2 hover:bg-orange-50 hover:text-orange-500 transition">E-learning</Link>
                <Link to="/formationSessions" className="block px-4 py-2 hover:bg-orange-50 hover:text-orange-500 transition">Sessions Programmées</Link>
              </div>
            )}
          </div>
          <Link to="/evenements" className={`transition hover:text-orange-500 ${isDarkText ? 'text-gray-700' : 'text-white'}`}>Évènements</Link>
          <button onClick={() => handleScrollTo('temoignages')} className={`transition hover:text-orange-500 ${isDarkText ? 'text-gray-700' : 'text-white'}`}>Témoignages</button>
          <button onClick={() => handleScrollTo('contact')} className={`transition hover:text-orange-500 ${isDarkText ? 'text-gray-700' : 'text-white'}`}>Contact</button>
        </div>

        {/* BOUTON COMPTE - Toujours visible sur desktop et mobile */}
        <div className="flex items-center z-50 space-x-4">
          <Link to="/register" className="px-5 py-2 bg-orange-600 text-white rounded-md font-medium hover:bg-orange-700 transition text-sm">
            Compte
          </Link>
          
          {/* Menu Hamburger - visible uniquement sur mobile */}
          <button onClick={() => setIsOpen(!isOpen)} className={`md:hidden p-2 ${isDarkText ? 'text-gray-800' : 'text-white'}`}>
            {isOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}
      <div className={`md:hidden fixed inset-0 bg-white z-40 flex flex-col pt-20 pb-10 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col items-center space-y-4 font-medium text-lg px-8 overflow-y-auto">
          <Link to="/" onClick={() => setIsOpen(false)} className="w-full py-2 border-b text-gray-800 hover:text-orange-500">Accueil</Link>
          <Link to="/a-propos" onClick={() => setIsOpen(false)} className="w-full py-2 border-b text-gray-800 hover:text-orange-500">À propos</Link>
          <Link to="/services" onClick={() => setIsOpen(false)} className="w-full py-2 border-b text-gray-800 hover:text-orange-500">Nos Services</Link>
          <Link to="/elearning" onClick={() => setIsOpen(false)} className="w-full py-2 border-b text-gray-800 hover:text-orange-500">E-learning</Link>
          <Link to="/formationSessions" onClick={() => setIsOpen(false)} className="w-full py-2 border-b text-gray-800 hover:text-orange-500">Sessions Programmées</Link>
          <button onClick={() => handleScrollTo('evenements')} className="w-full py-2 border-b text-left text-gray-800 hover:text-orange-500">Évènements</button>
          <button onClick={() => handleScrollTo('temoignages')} className="w-full py-2 border-b text-left text-gray-800 hover:text-orange-500">Témoignages</button>
          <button onClick={() => handleScrollTo('contact')} className="w-full py-2 border-b text-left text-gray-800 hover:text-orange-500">Contact</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;