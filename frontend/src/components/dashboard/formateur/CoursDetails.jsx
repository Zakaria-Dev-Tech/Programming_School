import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../services/api';
import { 
  HiOutlineArrowLeft, HiOutlinePlus, 
  HiOutlineTrash, HiOutlinePencilAlt, HiOutlinePlay,
  HiOutlineQuestionMarkCircle, HiX 
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import ModalCours from './ModalCours';
import ConfirmationModale from './ConfirmationModale'; 
import VideoModal from './VideoModal';
import QuizzEditor from './QuizzEditor'; 

const CoursDetail = () => {
  const { id } = useParams();
  const [formation, setFormation] = useState(null);
  const [chapitres, setChapitres] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedCours, setSelectedCours] = useState(null);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [previewCours, setPreviewCours] = useState(null);

  // ÉTATS POUR LE QUIZ
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [coursForQuiz, setCoursForQuiz] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const formationData = await api.get(`/formations/${id}`);
      setFormation(formationData);

      const response = await api.get(`/formations/${id}/cours`);
      const actualData = Array.isArray(response) ? response : (response?.data || []);
      
      const sortedData = [...actualData].sort((a, b) => a.ordre - b.ordre);
      setChapitres(sortedData);
    } catch (error) {
      toast.error("Impossible de charger les données");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ACTIONS

  const handlePreview = (chapitre) => {
    if (!chapitre || !chapitre.contenu_url) {
      return toast.error("Contenu indisponible");
    }
    setPreviewCours(chapitre);
    setIsVideoModalOpen(true);
  };

  const openDeleteConfirm = (cours) => {
    setSelectedCours(cours);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/cours/${selectedCours.id}`);
      setChapitres(chapitres.filter(c => c.id !== selectedCours.id));
      toast.success("Chapitre supprimé");
      setIsConfirmOpen(false);
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteLoading(false);
      setSelectedCours(null);
    }
  };

  const handleEdit = (cours) => {
    setSelectedCours(cours); 
    setIsModalOpen(true);
  };

  // LOGIQUE QUIZ
  const handleOpenQuiz = (cours) => {
    setCoursForQuiz(cours);
    setIsQuizModalOpen(true);
  };

  if (loading && !formation) return (
    <div className="flex flex-col items-center justify-center h-64 text-blue-600">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-current"></div>
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link to="/formateur/mes-formations" className="flex items-center text-slate-400 hover:text-blue-600 transition-all mb-4 group w-fit">
          <HiOutlineArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold">Retour aux formations</span>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{formation?.titre}</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">Gestion du programme pédagogique</p>
          </div>
          
          <button 
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 active:scale-95"
            onClick={() => { setSelectedCours(null); setIsModalOpen(true); }}
          >
            <HiOutlinePlus className="w-5 h-5" />
            Nouveau chapitre
          </button>
        </div>
      </div>

      {/* Liste des chapitres */}
      <div className="space-y-3">
        {chapitres.map((chapitre, index) => (
          <div key={chapitre.id} className="bg-white border border-slate-200/60 rounded-2xl p-4 flex items-center justify-between hover:border-blue-300 transition-all group shadow-sm">
            <div className="flex items-center gap-5">
              <div className="bg-slate-50 text-slate-400 font-bold w-10 h-10 rounded-xl flex items-center justify-center border border-slate-100 text-sm">
                {String(chapitre.ordre || index + 1).padStart(2, '0')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{chapitre.titre}</h3>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${chapitre.statut === 'actif' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                    {chapitre.statut === 'actif' ? 'Actif' : 'Brouillon'}
                  </span>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-1">
              <button 
                onClick={() => handleOpenQuiz(chapitre)}
                title="Gérer le Quiz" 
                className="p-2.5 text-amber-500 hover:bg-amber-50 rounded-xl transition-all"
              >
                <HiOutlineQuestionMarkCircle className="w-5 h-5" />
              </button>
              <button onClick={() => handlePreview(chapitre)} title="Aperçu" className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                <HiOutlinePlay className="w-5 h-5" />
              </button>
              <button onClick={() => handleEdit(chapitre)} title="Modifier" className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                <HiOutlinePencilAlt className="w-5 h-5" />
              </button>
              <button onClick={() => openDeleteConfirm(chapitre)} title="Supprimer" className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                <HiOutlineTrash className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODALE QUIZ */}
      {isQuizModalOpen && coursForQuiz && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-50 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="sticky top-0 bg-white/90 backdrop-blur-md px-8 py-5 border-b border-slate-100 flex justify-between items-center z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Quiz : {coursForQuiz.titre}</h2>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Configuration P.School</p>
              </div>
              <button onClick={() => setIsQuizModalOpen(false)} className="p-2 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-all">
                <HiX className="text-xl" />
              </button>
            </div>
            <div className="p-6">
              <QuizzEditor coursId={coursForQuiz.id} />
            </div>
          </div>
        </div>
      )}

      {/* Autres Modals */}
      <ModalCours isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedCours(null); }} formationId={id} onRefresh={fetchData} initialData={selectedCours} />
      <ConfirmationModale isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleConfirmDelete} loading={deleteLoading} title="Supprimer ce chapitre ?" message={`Êtes-vous sûr de vouloir supprimer "${selectedCours?.titre}" ?`} />
      <VideoModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} cours={previewCours} />
    </div>
  );
};

export default CoursDetail;