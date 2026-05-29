import { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Quels sont les prérequis pour suivre une formation ?",
      reponse: "Aucun prérequis technique nécessaire. Nous partons des bases et progressons pas à pas avec nos formateurs experts."
    },
    {
      question: "Les formations sont-elles certifiantes ?",
      reponse: "Oui, à l'issue de chaque formation, vous recevez un certificat de réussite reconnu par nos partenaires."
    },
    {
      question: "Puis-je suivre une formation à distance ?",
      reponse: "Oui, nous proposons des formations en présentiel dans nos centres (Ouaga 2000, Bobo-Dioulasso) et en ligne via notre plateforme e-learning."
    },
    {
      question: "Quels sont les modes de paiement acceptés ?",
      reponse: "Nous acceptons les paiements par Mobile Money (Orange Money, Moov Money), virement bancaire et bientôt Carte Bancaire."
    },
    {
      question: "Comment inscrire mon enfant à une formation ?",
      reponse: "Créez un compte Parent, puis ajoutez vos enfants dans l'espace 'Mes enfants' et choisissez les formations qui les intéressent."
    },
    {
      question: "Que faire si j'oublie mon mot de passe ?",
      reponse: "Cliquez sur 'Mot de passe oublié' sur la page de connexion, un lien de réinitialisation vous sera envoyé par email."
    }
  ];

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 ">
      <div className="max-w-4xl mx-auto px-5">
        
        {/* En-tête */}
        <div className="text-center mb-12">
          
          <h2 className="text-3xl font-bold uppercase text-orange-600 mt-2">
            Questions fréquentes
          </h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Retrouvez les réponses aux questions les plus posées sur nos formations et services
          </p>
     
        </div>

        {/* Liste des questions */}
        <div className="space-y-10">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-2xl text-blue-900">{faq.question}</span>
                <HiChevronDown 
                  className={`w-5 h-5 text-gray-800 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              <div 
                className={`px-6 pb-4 text-gray-600 text-xl leading-relaxed border-t border-gray-100 transition-all duration-300 ${
                  openIndex === index ? 'block' : 'hidden'
                }`}
              >
                {faq.reponse}
              </div>
            </div>
          ))}
        </div>

        {/* Message supplémentaire */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Une question supplémentaire ? <a href="#contact" className="text-orange-600 hover:underline">Contactez-nous</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;