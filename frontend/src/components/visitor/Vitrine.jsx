import HeroSections from './sections/HeroSections';
import FormationsSections from './sections/FormationsSections';
import ServicesSections from './sections/ServicesSections';

import ContactSections from './sections/ContactSections';

import TemoignagesSections from './sections/TemoignagesSections';
import AProposSection from './sections/AproposSections';

const Vitrine = () => {
  return (
    <div>
      <div data-aos="fade-up">
         <HeroSections/>
      </div>
      <AProposSection></AProposSection>
       <div data-aos="fade-up" data-aos-delay="100">
          <FormationsSections />
    </div>
    <div data-aos="fade-up" data-aos-delay="200">
        <ServicesSections />
    </div>
   
      <TemoignagesSections></TemoignagesSections>
     
   
      <ContactSections />
    </div>
  );
};

export default Vitrine;