import { useState, useEffect } from 'react';
import logo from '../../assets/logo-removebg-preview (1).png';

const Loading = ({ onLoadingComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Timer pour fermer le loader après 2.5 secondes
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        if (onLoadingComplete) onLoadingComplete();
      }, 800);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center  transition-all duration-800 ${fadeOut ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}>
      
      {/* Cercle qui tourne autour du logo */}
      <div className="relative">
        {/* Cercle animé qui tourne */}
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-400 border-r-blue-400 border-b-transparent border-l-transparent animate-spin"></div>
        
        {/* Cercle extérieur avec pulsation */}
           {/* <div className="absolute inset-0 rounded-full border-4 border-cyan-500 animate-ping opacity-50"></div>*/}
        
        {/* Logo */}
        <div className="w-28 h-28 md:w-36 md:h-36  rounded-2xl flex items-center justify-center ">
          <img 
            src={logo} 
            alt="Logo Programming School" 
            className="w-16 h-16 md:w-20 md:h-20 object-contain"
          />
        </div>
      </div>
      
      {/* Programming School */}
      
      
    </div>
  );
};

export default Loading;