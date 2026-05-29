import HeroSections from './sections/HeroSections';
import QuestionSections from './sections/QuestionSections';

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

     <div id="faq">
        <QuestionSections />
      </div>

      {/* Section Contact */}
      <div id="contact">
        <ContactSections />
      </div>
    </div>
  );
};

export default Vitrine;