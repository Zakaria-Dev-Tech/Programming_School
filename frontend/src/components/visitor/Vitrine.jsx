import HeroSections from './sections/HeroSections';
//import ServicesSections from './sections/ServicesSections';
//import FormationSessions from './sections/FormationSessions'; // Ton nouveau slider
import ContactSections from './sections/ContactSections';
import TemoignagesSections from './sections/TemoignagesSections';
//import AProposSection from './sections/AproposSections';

const Vitrine = () => {
  return (
    <div>
      {/* Section Accueil */}
      <div id="hero" data-aos="fade-up">
         <HeroSections/>
      </div>

      {/* Section À Propos */}
         {/*<div id="apropos">
        <AProposSection />
      </div>*/}

      {/* Section Formations Programmées (Slider d'affiches) */}
      {/* C'est cet ID que la Navbar va chercher pour le scroll */}
     {/*  <div id="formations-programmees" data-aos="fade-up" data-aos-delay="100">
          <FormationSessions /> 
      </div>

      {/* Section Services */}
      {/* <div id="services" data-aos="fade-up" data-aos-delay="200">
          <ServicesSections />
      </div>*/}
   
      {/* Section Témoignages */}
      <div id="temoignages">
        <TemoignagesSections />
      </div>

      {/* Section Évènements (Historique/Réalisations de P.School) */}
        {/*<div id="evenements">
        Tu peux ajouter ici un composant plus tard pour tes photos d'évènements 
        <section className="py-16 bg-white">
           <div className="max-w-6xl mx-auto px-5 text-center">
              <h2 className="text-3xl font-bold text-gray-800">Nos Évènements</h2>
              <p className="text-gray-500 mt-2">Découvrez les moments forts de P.School</p>
              {/* Contenu à venir *
           </div>
        </section>
      </div>*/}
     
      {/* Section Contact */}
      <div id="contact">
        <ContactSections />
      </div>
    </div>
  );
};

export default Vitrine;