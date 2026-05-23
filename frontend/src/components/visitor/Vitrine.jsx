import HeroSections from './sections/HeroSections';

import ContactSections from './sections/ContactSections';
import TemoignagesSections from './sections/TemoignagesSections';


const Vitrine = () => {
  return (
    <div>
      {/* Section Accueil */}
      <div id="hero" data-aos="fade-up">
         <HeroSections/>
      </div>

   
      {/* Section Témoignages */}
      <div id="temoignages">
        <TemoignagesSections />
      </div>


      {/* Section Contact */}
      <div id="contact">
        <ContactSections />
      </div>
    </div>
  );
};

export default Vitrine;