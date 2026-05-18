import { HiOutlineX, HiOutlineDownload } from 'react-icons/hi';

const VideoModal = ({ isOpen, onClose, cours }) => {
  if (!isOpen || !cours) return null;

  // Détection du type de fichier
  const isPDF = cours.contenu_url?.toLowerCase().endsWith('.pdf');

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/95 backdrop-blur-md p-2 md:p-4 animate-in fade-in duration-300">
      
      {/* Container du Modal */}
      <div className={`bg-black rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden relative border border-white/10 ${isPDF ? 'h-[90vh]' : 'h-fit'}`}>
        
        {/* Header flottant */}
        <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center bg-gradient-to-b from-black/90 via-black/40 to-transparent z-20">
          <div className="flex flex-col">
            <h3 className="text-white font-bold truncate max-w-[180px] md:max-w-md">
              {cours.titre}
            </h3>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
              {isPDF ? 'Document PDF' : 'Leçon Vidéo'}
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Bouton Télécharger */}
            <a 
              href={cours.contenu_url} 
              target="_blank" 
              rel="noopener noreferrer"
              download
              className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all border border-white/10 shadow-lg"
            >
              <HiOutlineDownload className="w-5 h-5" />
              <span className="hidden sm:inline">Télécharger</span>
            </a>

            {/* Bouton Fermer */}
            <button 
              onClick={onClose} 
              className="p-2 bg-white/10 hover:bg-red-500/20 hover:text-red-400 rounded-full text-white transition-all border border-white/10"
            >
              <HiOutlineX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Zone de Contenu */}
        <div className={`w-full flex items-center justify-center bg-slate-950 ${isPDF ? 'h-full pt-20' : 'aspect-video'}`}>
          {isPDF ? (
            <iframe 
         
              src={`${cours.contenu_url}#toolbar=0&navpanes=0`} 
              className="w-full h-full border-none"
              title={cours.titre}
            />
          ) : (
            <video 
              controls 
              autoPlay 
              className="w-full h-full max-h-[80vh]"
              controlsList="nodownload" // Masque le bouton de téléchargement natif du lecteur
            >
              <source src={cours.contenu_url} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoModal;