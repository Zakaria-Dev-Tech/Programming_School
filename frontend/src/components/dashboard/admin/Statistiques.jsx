import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { HiOutlineChartBar, HiOutlineTrendingUp } from 'react-icons/hi';

const Statistiques = ({ data }) => {
  const { 
    totalAdultes = 0, 
    totalEnfants = 0, 
    donneesEvolution = [], 
    donneesFormations = [] 
  } = data;

  const donneesProfils = [
    { name: 'Adultes', value: totalAdultes },
    { name: 'Enfants', value: totalEnfants },
  ];

  const COULEURS = ['#2563eb', '#f97316']; 

  return (
    <div className="mt-8 space-y-8">
      
      {/* SECTION 1 : COURBE D'ÉVOLUTION REELLE DU CHIFFRE D'AFFAIRES */}
      <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <HiOutlineTrendingUp className="text-emerald-500 text-xl" />
            Évolution du Chiffre d'Affaires & Inscriptions (Mensuel)
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Suivi de la croissance financière réelle de P.School</p>
        </div>
        
        <div style={{ width: '100%', height: 300 }}>
          {donneesEvolution.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm italic">
              Aucune donnée historique trouvée
            </div>
          ) : (
            // L'ajout de width et height numériques fixes en fallback stabilise le premier rendu
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={donneesEvolution} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="mois" tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
                <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} FCFA`, 'Revenus réalisés']} />
                <Area type="monotone" dataKey="revenus" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenus)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* SECTION 2 : DEUX GRAPHIQUES EN CÔTE À CÔTE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* HISTOGRAMME : POPULARITÉ REELLE DES FORMATIONS */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <HiOutlineChartBar className="text-blue-500 text-xl" />
              Inscriptions par Spécialité et Type de Profil
            </h3>
          </div>
          
          <div style={{ width: '100%', height: 260 }}>
            {donneesFormations.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm italic">
                En attente d'inscriptions
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={donneesFormations}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#cbd5e1" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#cbd5e1" />
                  <Tooltip />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Adultes" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Enfants" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* DIAGRAMME CIRCULAIRE : PROFIL DE CLIENTÈLE */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-base font-bold text-gray-800">Part des Apprenants</h3>
            <p className="text-xs text-gray-400 mt-0.5">Segmentation de l'audience</p>
          </div>
          
         
          <div className="w-full flex items-center justify-center h-44 relative">
            <PieChart width={200} height={180}>
              <Pie
                data={donneesProfils}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {donneesProfils.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COULEURS[index % COULEURS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} apprenant(s)`, 'Effectif']} />
            </PieChart>
            
            <div className="absolute text-center">
              <p className="text-xl font-black text-gray-800">{totalAdultes + totalEnfants}</p>
              <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Élèves</p>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-2 text-gray-600">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span> 
                Adultes
              </span>
              <span className="font-bold">{totalAdultes}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-2 text-gray-600">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span> 
                Enfants
              </span>
              <span className="font-bold">{totalEnfants}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Statistiques;