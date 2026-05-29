const evenements = [
  {
    id: 1,
    titre: "Robotics for Good Youth Challenge 2026",
    date: "28 Mars 2026",
    lieu: "Digital Business School, Ouagadougou",
    theme: "Sécurité alimentaire",
    description: "Deuxième édition de cette compétition nationale de robotique organisée par Programming School. Les équipes devaient programmer des robots capables de simuler un cycle agricole complet : semer, arroser intelligemment, et récolter des fruits en distinguant les mûrs, non mûrs et pourris.",
    resultat: "Team IBSA Junior (Junior) / Team Open Mind (Senior)",
    badge: "Compétition nationale",
    badgeColor: "green",
    couverture: "/assets/evenements/robotics_2026/couverture.jpeg",
    photos: [
      "/assets/evenements/robotics_2026/competition.jpeg",
      "/assets/evenements/robotics_2026/medaille.jpeg",
      "/assets/evenements/robotics_2026/vainqueur.jpeg"
    ]
  },
  {
    id: 2,
    titre: "Conférence Bitcoin Africa 2026",
    date: "18 Avril 2026",
    lieu: "Ouagadougou",
    theme: "Formation sur les cryptomonnaies",
    description: "Les élèves de PSCHOOL ont participé à la conférence internationale Bitcoin Africa. Ils ont pu échanger avec des experts et recevoir une formation sur les bitcoins. Une belle opportunité pour sensibiliser les jeunes à la finance décentralisée et aux technologies blockchain.",
    resultat: "Remise des bandes dessinées 'Bitcoin Kids' aux participants",
    badge: "Conférence",
    badgeColor: "orange",
    couverture: "/assets/evenements/bitcoin-2026/couverture.jpeg",
    photos: [
      "/assets/evenements/bitcoin-2026/conference.jpeg",
      "/assets/evenements/bitcoin-2026/distribution.jpeg",
      "/assets/evenements/bitcoin-2026/eleves.jpeg"
    ]
  },
  {
    id: 3,
    titre: "Robotics for Good Youth Challenge 2025",
    date: "Mars 2025",
    lieu: "Ouagadougou",
    theme: "Catastrophes naturelles",
    description: "Première édition de cette compétition nationale de robotique organisée par Programming School. Les équipes devaient programmer des robots capables de répondre à des situations de catastrophes naturelles. L'événement a permis de sélectionner les équipes pour la compétition mondiale à Genève. Une aventure qui a marqué l'histoire de PSCHOOL.",
    resultat: "Équipe AKO : Médaille de bronze mondiale / Équipe PSCHOOL KIDS : Champion junior",
    badge: "Compétition internationale",
    badgeColor: "blue",
    couverture: "/assets/evenements/robotics-2025/couverture.jpeg",
    photos: [
      "/assets/evenements/robotics-2025/competition.jpeg",
      "/assets/evenements/robotics-2025/medaille.jpeg",
      "/assets/evenements/robotics-2025/vainqueur.jpeg"
    ]
  }
];

// Liste de toutes les photos de la galerie
const photosGalerie = [
  { id: 1, url: "/assets/evenements/galerie/image-1.jpeg", titre: "", evenementId: 1 },
  { id: 2, url: "/assets/evenements/galerie/image-2.jpeg", titre: "", evenementId: 1 },
  { id: 3, url: "/assets/evenements/galerie/image-3.jpeg", titre: "", evenementId: 2 },
  { id: 4, url: "/assets/evenements/galerie/image-4.jpeg", titre: "", evenementId: 2 },
  { id: 5, url: "/assets/evenements/galerie/image-5.jpeg", titre: "", evenementId: 3 },
  { id: 6, url: "/assets/evenements/galerie/image-6.jpeg", titre: "", evenementId: 3 },
  { id: 7, url: "/assets/evenements/galerie/image-7.jpeg", titre: "", evenementId: 1 },
  { id: 8, url: "/assets/evenements/galerie/image-8.jpeg", titre: "", evenementId: 2 },
];

export { evenements, photosGalerie };