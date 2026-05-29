import { FaChalkboardTeacher, FaRocket, FaGlobe, FaUsers, FaLightbulb, FaCode, FaRobot, FaMicrochip } from 'react-icons/fa';
import { HiOutlineAcademicCap, HiOutlineChip, HiOutlineLightningBolt } from 'react-icons/hi';

const AproposPage = () => {
  const domaines = [
    { name: "Éducation", icon: <HiOutlineAcademicCap className="w-3 h-3" /> },
    { name: "Santé", icon: <FaLightbulb className="w-3 h-3" /> },
    { name: "Énergie", icon: <HiOutlineLightningBolt className="w-3 h-3" /> },
    { name: "Informatique", icon: <FaCode className="w-3 h-3" /> },
    { name: "Robotique", icon: <FaRobot className="w-3 h-3" /> },
    { name: "IA", icon: <HiOutlineChip className="w-3 h-3" /> }
  ];

  return (
    <section className="pt-32 pb-16 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-5">
        
        <div className="text-center pt-24 mb-12">
          <div className="relative flex items-center justify-center">
         
            <span className="px-4 py-1.5  rounded-full text-blue-900 font-semibold text-4xl uppercase tracking-wide ">
              À propos de nous
            </span>
        
          </div>
        </div>

        {/* Grille de trois cartes - version blanche avec ombre */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="text-blue-900 text-3xl mb-4"><FaRocket /></div>
            <h3 className="text-gray-800 text-xl font-semibold mb-3">Formation complète et innovante</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              PSCHOOL propose un parcours unique couvrant le coding, la robotique, l'électronique, la mécanique et l'intelligence artificielle pour les jeunes de 5 à 19 ans.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="text-blue-900 text-3xl mb-4"><FaGlobe /></div>
            <h3 className="text-gray-800 text-xl font-semibold mb-3">École reconnue à l'international</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Avec 2 000+ apprenants et des médailles internationales, nous formons les futurs leaders du numérique.
            </p>
            <div className="flex flex-wrap gap-2">
              {domaines.map((domaine, index) => (
                <span key={index} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                  {domaine.icon} {domaine.name}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="text-blue-900 text-3xl mb-4"><FaChalkboardTeacher /></div>
            <h3 className="text-gray-800 text-xl font-semibold mb-3">Apprentissage en présentiel</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Immersion totale et encadrement physique à Ouagadougou et Bobo-Dioulasso pour garantir une maîtrise parfaite des outils technologiques.
            </p>
          </div>
        </div>
        
        {/* Statistiques */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
            <div className="text-2xl font-bold text-blue-900">2000+</div>
            <div className="text-xs text-gray-600 mt-1">Apprenants formés</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
            <div className="text-2xl font-bold text-blue-900">2021</div>
            <div className="text-xs text-gray-600 mt-1">Année de création</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
            <div className="text-2xl font-bold text-blue-900">2</div>
            <div className="text-xs text-gray-600 mt-1">Centres physiques</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
            <div className="text-2xl font-bold text-blue-900">5-19 ans+</div>
            <div className="text-xs text-gray-600 mt-1">Tranche d'âge</div>
          </div>
        </div>

        {/* Nos valeurs */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-4xl font-semibold text-blue-900 text-center mb-6">Nos valeurs</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-10 h-10  flex items-center justify-center mx-auto mb-2">
                <FaUsers className="text-blue-900 text-sm"/>
              </div>
              <p className="text-xs font-medium text-gray-700">Encadrement</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10  flex items-center justify-center mx-auto mb-2">
                <FaCode className="text-blue-900 text-sm"/>
              </div>
              <p className="text-xs font-medium text-gray-700">Programme</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 flex items-center justify-center mx-auto mb-2">
                <FaRobot className="text-blue-900 text-sm"/>
              </div>
              <p className="text-xs font-medium text-gray-700">Équipement</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 flex items-center justify-center mx-auto mb-2">
                <FaMicrochip className="text-blue-900 text-sm"/>
              </div>
              <p className="text-xs font-medium text-gray-700">Innovation</p>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default AproposPage;