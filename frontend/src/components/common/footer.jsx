import { Link } from 'react-router-dom';
import { FaFacebookF, FaLinkedinIn, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaChevronRight, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className=" bg-blue-950 text-white">
      
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Colonne 1 - Branding */}
          <div>
            <Link to="/" className="inline-block hover:opacity-80 transition-opacity mb-4">
              <img src="/assets/logo-removebg-preview (1).png" alt="Pschool Logo" className="h-10 w-auto" />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              La référence de la formation numérique au Burkina Faso. Maîtrisez le code, 
              la robotique et le futur du numérique avec P.School.
            </p>
           
            <div className="flex gap-3">
              <a 
                href="https://www.facebook.com/share/1JXcCfP7QV/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors"
              >
                <FaFacebookF size={14} />
              </a>
              <a 
                href="https://www.tiktok.com/@mamatech_bf?is_from_webapp=1&sender_device=pc" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white transition-colors"
              >
                <FaTiktok size={14} />
              </a>
              <a 
                href="https://www.linkedin.com/company/programming-school/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center text-gray-400 hover:bg-cyan-700 hover:text-white transition-colors"
              >
                <FaLinkedinIn size={14} />
              </a>
              <a 
                href="https://wa.me/22607571645" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-colors"
              >
                <FaWhatsapp size={14} />
              </a>
            </div>
          </div>
          
          {/* Colonne 2 - Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase mb-4">Navigation</h4>
            <ul className="space-y-2">
              {['Accueil', 'Formations', 'Services', 'Contact'].map((item) => (
                <li key={item}>
                  <button 
                    onClick={() => scrollToSection(item.toLowerCase())} 
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    <FaChevronRight className="w-2.5 h-2.5 text-cyan-500" />
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 - Services */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase mb-4">Nos services</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="hover:text-white transition-colors cursor-pointer">Développement Web & Mobile</li>
              <li className="hover:text-white transition-colors cursor-pointer">Maintenance informatique</li>
              <li className="hover:text-white transition-colors cursor-pointer">Installation réseaux</li>
            </ul>
          </div>

          {/* Colonne 4 - Contact */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase mb-4">Nous trouver</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <FaMapMarkerAlt className="text-cyan-500 mt-0.5 shrink-0" size={14} />
                <span>Ouaga 2000, Secteur 53,<br/>Boulevard Muammar Khadafi</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FaPhoneAlt className="text-cyan-500 shrink-0" size={14} />
                <a href="tel:+22607571645" className="hover:text-white transition">+226 07 57 16 45</a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FaEnvelope className="text-cyan-500 shrink-0" size={14} />
                <a href="mailto:infos@pschool.pro" className="hover:text-white transition">infos@pschool.pro</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-300 text-xs">
          <p>&copy; 2026 Programming School. Burkina Faso.</p>
          <div className="flex gap-6">
            <Link to="/politique" className="hover:text-white transition-colors">Confidentialité</Link>
            <Link to="/mentions" className="hover:text-white transition-colors">Mentions légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;