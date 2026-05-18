import { useState, useEffect } from 'react';
import { HiOutlineMail, HiOutlinePhone, HiOutlineClock, HiOutlineUser } from 'react-icons/hi';
import api from '../../../services/api';

const GestionMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageSelectionne, setMessageSelectionne] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await api.get('/admin/messages');
      
      setMessages(data);
    } catch (error) {
      console.error("Erreur chargement messages admin:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleLu = async (id) => {
    try {
      await api.put(`/admin/messages/${id}/toggle-lu`);
      fetchMessages();
      if (messageSelectionne && messageSelectionne.id === id) {
        setMessageSelectionne({ ...messageSelectionne, lu: !messageSelectionne.lu });
      }
    } catch (error) {
      console.error("Erreur modification statut message:", error);
    }
  };

  if (loading) return (
    <div className="p-12 text-center text-gray-400 italic">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
      Chargement de la boîte de réception...
    </div>
  );

  return (
    <div className="p-1">
      <h2 className="text-2xl font-bold text-gray-800">Messages de contact</h2>
      <p className="text-gray-500 text-sm mt-1 mb-8">
        Consultez et gérez les questions envoyées par les visiteurs depuis la vitrine P.School.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* COLONNE 1 & 2 : LISTE DES MESSAGES */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden lg:col-span-2">
          {messages.length === 0 ? (
            <div className="p-12 text-center text-gray-400 italic">Aucun message reçu pour le moment.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  onClick={() => setMessageSelectionne(msg)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
                    !msg.lu ? 'bg-blue-50/40 border-l-4 border-blue-500 font-medium' : ''
                  } ${messageSelectionne?.id === msg.id ? 'bg-gray-100/70' : ''}`}
                >
                  <div className="space-y-1 max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-800 text-sm font-semibold">{msg.nom}</span>
                      {!msg.lu && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase">Nouveau</span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm truncate">{msg.sujet}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><HiOutlineClock /> {new Date(msg.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleLu(msg.id);
                    }}
                    className={`p-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors border ${
                      msg.lu 
                        ? 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100' 
                        : 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {msg.lu ? 'Marquer non lu' : 'Marquer lu'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COLONNE 3 : PANNEAU DE LECTURE DU MESSAGE SÉLECTIONNÉ */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sticky top-4">
          {messageSelectionne ? (
            <div className="space-y-5">
              <div className="border-b pb-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Sujet du besoin</span>
                <h3 className="text-base font-bold text-gray-800 mt-0.5">{messageSelectionne.sujet}</h3>
              </div>

              <div className="space-y-2.5 text-sm text-gray-600">
                <div className="flex items-center gap-2.5">
                  <HiOutlineUser className="text-gray-400 text-lg flex-shrink-0" />
                  <span className="text-gray-800 font-medium">{messageSelectionne.nom}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <HiOutlineMail className="text-gray-400 text-lg flex-shrink-0" />
                  <a href={`mailto:${messageSelectionne.email}`} className="text-blue-600 hover:underline break-all">{messageSelectionne.email}</a>
                </div>
                <div className="flex items-center gap-2.5">
                  <HiOutlinePhone className="text-gray-400 text-lg flex-shrink-0" />
                  <a href={`tel:${messageSelectionne.telephone}`} className="text-gray-800 hover:underline">{messageSelectionne.telephone}</a>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-bold mb-2">Message du visiteur</p>
                <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                  {messageSelectionne.message}
                </p>
              </div>

              <div className="text-[10px] text-gray-400 italic text-right">
                Reçu le : {new Date(messageSelectionne.created_at).toLocaleString('fr-FR')}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 text-sm italic flex flex-col items-center justify-center gap-2">
              <HiOutlineMail className="text-4xl text-gray-300" />
              Sélectionnez un message à gauche pour lire son contenu complet.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};


export default GestionMessages;