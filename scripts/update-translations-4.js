const fs = require('fs')

const additions = {
  en: {
    competitors: {
      discover: 'Discover competitors',
    },
    discover: {
      title: 'Discover competitors',
      subtitle: 'Find local businesses to track in your area',
      locationLabel: 'Your area',
      locationPlaceholder: 'e.g. Stockholm, Göteborg, Malmö',
      categoryLabel: 'Category',
      allCategories: 'All categories',
      searchBtn: 'Find competitors',
      trackedLabel: 'Already tracking',
      suggestedLabel: 'Suggested searches',
      openMaps: 'Open in Google Maps',
      addCompetitor: 'Add competitor',
      relatedLabel: 'Related categories to explore',
      tipTitle: 'How to use',
      tip1: 'Search for businesses on Google Maps',
      tip2: 'Copy their website URL',
      tip3: 'Add them as a competitor above',
      noLocation: 'Enter a location above to get search suggestions.',
      mapsQueryNote: 'Opens a pre-filled Google Maps search — find a business, copy their website, and add it.',
    },
  },
  sv: {
    competitors: {
      discover: 'Hitta konkurrenter',
    },
    discover: {
      title: 'Hitta konkurrenter',
      subtitle: 'Hitta lokala företag att bevaka i ditt område',
      locationLabel: 'Ditt område',
      locationPlaceholder: 't.ex. Stockholm, Göteborg, Malmö',
      categoryLabel: 'Kategori',
      allCategories: 'Alla kategorier',
      searchBtn: 'Hitta konkurrenter',
      trackedLabel: 'Bevakar redan',
      suggestedLabel: 'Föreslagna sökningar',
      openMaps: 'Öppna i Google Maps',
      addCompetitor: 'Lägg till konkurrent',
      relatedLabel: 'Relaterade kategorier att utforska',
      tipTitle: 'Så här gör du',
      tip1: 'Sök efter företag på Google Maps',
      tip2: 'Kopiera deras webbplats-URL',
      tip3: 'Lägg till dem som konkurrent ovan',
      noLocation: 'Ange ett område ovan för att få sökförslag.',
      mapsQueryNote: 'Öppnar en förifylld Google Maps-sökning — hitta ett företag, kopiera deras webbplats och lägg till dem.',
    },
  },
  da: {
    competitors: { discover: 'Find konkurrenter' },
    discover: {
      title: 'Find konkurrenter', subtitle: 'Find lokale virksomheder at overvåge i dit område',
      locationLabel: 'Dit område', locationPlaceholder: 'f.eks. København, Aarhus, Odense',
      categoryLabel: 'Kategori', allCategories: 'Alle kategorier', searchBtn: 'Find konkurrenter',
      trackedLabel: 'Overvåger allerede', suggestedLabel: 'Foreslåede søgninger',
      openMaps: 'Åbn i Google Maps', addCompetitor: 'Tilføj konkurrent',
      relatedLabel: 'Relaterede kategorier at udforske', tipTitle: 'Sådan bruger du det',
      tip1: 'Søg efter virksomheder på Google Maps', tip2: 'Kopier deres hjemmeside-URL',
      tip3: 'Tilføj dem som konkurrent ovenfor', noLocation: 'Indtast et område ovenfor for at få søgeforslag.',
      mapsQueryNote: 'Åbner en præudfyldt Google Maps-søgning.',
    },
  },
  de: {
    competitors: { discover: 'Wettbewerber entdecken' },
    discover: {
      title: 'Wettbewerber entdecken', subtitle: 'Lokale Unternehmen in Ihrer Region finden',
      locationLabel: 'Ihr Gebiet', locationPlaceholder: 'z.B. Berlin, München, Hamburg',
      categoryLabel: 'Kategorie', allCategories: 'Alle Kategorien', searchBtn: 'Wettbewerber finden',
      trackedLabel: 'Bereits verfolgt', suggestedLabel: 'Vorgeschlagene Suchen',
      openMaps: 'In Google Maps öffnen', addCompetitor: 'Wettbewerber hinzufügen',
      relatedLabel: 'Verwandte Kategorien erkunden', tipTitle: 'Anleitung',
      tip1: 'Unternehmen auf Google Maps suchen', tip2: 'Website-URL kopieren',
      tip3: 'Als Wettbewerber hinzufügen', noLocation: 'Geben Sie oben einen Ort ein.',
      mapsQueryNote: 'Öffnet eine vorausgefüllte Google Maps-Suche.',
    },
  },
  es: {
    competitors: { discover: 'Descubrir competidores' },
    discover: {
      title: 'Descubrir competidores', subtitle: 'Encuentra negocios locales para monitorear',
      locationLabel: 'Tu área', locationPlaceholder: 'ej. Madrid, Barcelona, Sevilla',
      categoryLabel: 'Categoría', allCategories: 'Todas las categorías', searchBtn: 'Encontrar competidores',
      trackedLabel: 'Ya monitoreando', suggestedLabel: 'Búsquedas sugeridas',
      openMaps: 'Abrir en Google Maps', addCompetitor: 'Añadir competidor',
      relatedLabel: 'Categorías relacionadas', tipTitle: 'Cómo usar',
      tip1: 'Busca negocios en Google Maps', tip2: 'Copia su URL del sitio web',
      tip3: 'Añádelos como competidor', noLocation: 'Ingresa una ubicación arriba.',
      mapsQueryNote: 'Abre una búsqueda pre-rellenada en Google Maps.',
    },
  },
  fi: {
    competitors: { discover: 'Löydä kilpailijoita' },
    discover: {
      title: 'Löydä kilpailijoita', subtitle: 'Etsi paikallisia yrityksiä seurattavaksi',
      locationLabel: 'Alueesi', locationPlaceholder: 'esim. Helsinki, Tampere, Turku',
      categoryLabel: 'Kategoria', allCategories: 'Kaikki kategoriat', searchBtn: 'Etsi kilpailijoita',
      trackedLabel: 'Jo seurannassa', suggestedLabel: 'Ehdotetut haut',
      openMaps: 'Avaa Google Mapsissa', addCompetitor: 'Lisää kilpailija',
      relatedLabel: 'Liittyvät kategoriat', tipTitle: 'Ohjeet',
      tip1: 'Etsi yrityksiä Google Mapsista', tip2: 'Kopioi heidän verkkosivusto-URL',
      tip3: 'Lisää kilpailijaksi', noLocation: 'Syötä alue yllä saadaksesi hakuehdotuksia.',
      mapsQueryNote: 'Avaa esitäytetyn Google Maps -haun.',
    },
  },
  fr: {
    competitors: { discover: 'Découvrir des concurrents' },
    discover: {
      title: 'Découvrir des concurrents', subtitle: 'Trouvez des entreprises locales à surveiller',
      locationLabel: 'Votre zone', locationPlaceholder: 'ex. Paris, Lyon, Marseille',
      categoryLabel: 'Catégorie', allCategories: 'Toutes catégories', searchBtn: 'Trouver des concurrents',
      trackedLabel: 'Déjà suivi', suggestedLabel: 'Recherches suggérées',
      openMaps: 'Ouvrir dans Google Maps', addCompetitor: 'Ajouter un concurrent',
      relatedLabel: 'Catégories connexes', tipTitle: 'Comment utiliser',
      tip1: 'Cherchez des entreprises sur Google Maps', tip2: 'Copiez leur URL de site web',
      tip3: 'Ajoutez-les comme concurrent', noLocation: 'Entrez un lieu ci-dessus.',
      mapsQueryNote: 'Ouvre une recherche Google Maps pré-remplie.',
    },
  },
  it: {
    competitors: { discover: 'Scopri concorrenti' },
    discover: {
      title: 'Scopri concorrenti', subtitle: 'Trova aziende locali da monitorare',
      locationLabel: 'La tua area', locationPlaceholder: 'es. Roma, Milano, Napoli',
      categoryLabel: 'Categoria', allCategories: 'Tutte le categorie', searchBtn: 'Trova concorrenti',
      trackedLabel: 'Già monitorato', suggestedLabel: 'Ricerche suggerite',
      openMaps: 'Apri in Google Maps', addCompetitor: 'Aggiungi concorrente',
      relatedLabel: 'Categorie correlate', tipTitle: 'Come usare',
      tip1: 'Cerca aziende su Google Maps', tip2: 'Copia il loro URL del sito web',
      tip3: 'Aggiungili come concorrente', noLocation: 'Inserisci una posizione sopra.',
      mapsQueryNote: 'Apre una ricerca Google Maps precompilata.',
    },
  },
  nl: {
    competitors: { discover: 'Concurrenten ontdekken' },
    discover: {
      title: 'Concurrenten ontdekken', subtitle: 'Vind lokale bedrijven om te volgen',
      locationLabel: 'Uw gebied', locationPlaceholder: 'bijv. Amsterdam, Rotterdam, Den Haag',
      categoryLabel: 'Categorie', allCategories: 'Alle categorieën', searchBtn: 'Concurrenten vinden',
      trackedLabel: 'Al gevolgd', suggestedLabel: 'Aanbevolen zoekopdrachten',
      openMaps: 'Openen in Google Maps', addCompetitor: 'Concurrent toevoegen',
      relatedLabel: 'Gerelateerde categorieën', tipTitle: 'Hoe te gebruiken',
      tip1: 'Zoek bedrijven op Google Maps', tip2: 'Kopieer hun website-URL',
      tip3: 'Voeg ze toe als concurrent', noLocation: 'Voer hierboven een locatie in.',
      mapsQueryNote: 'Opent een vooringevulde Google Maps-zoekopdracht.',
    },
  },
  no: {
    competitors: { discover: 'Finn konkurrenter' },
    discover: {
      title: 'Finn konkurrenter', subtitle: 'Finn lokale bedrifter å overvåke i ditt område',
      locationLabel: 'Ditt område', locationPlaceholder: 'f.eks. Oslo, Bergen, Trondheim',
      categoryLabel: 'Kategori', allCategories: 'Alle kategorier', searchBtn: 'Finn konkurrenter',
      trackedLabel: 'Overvåker allerede', suggestedLabel: 'Foreslåtte søk',
      openMaps: 'Åpne i Google Maps', addCompetitor: 'Legg til konkurrent',
      relatedLabel: 'Relaterte kategorier', tipTitle: 'Slik bruker du det',
      tip1: 'Søk etter bedrifter på Google Maps', tip2: 'Kopier nettstedets URL',
      tip3: 'Legg dem til som konkurrent', noLocation: 'Skriv inn et område ovenfor.',
      mapsQueryNote: 'Åpner et forhåndsutfylt Google Maps-søk.',
    },
  },
  pl: {
    competitors: { discover: 'Odkryj konkurentów' },
    discover: {
      title: 'Odkryj konkurentów', subtitle: 'Znajdź lokalne firmy do śledzenia',
      locationLabel: 'Twój obszar', locationPlaceholder: 'np. Warszawa, Kraków, Gdańsk',
      categoryLabel: 'Kategoria', allCategories: 'Wszystkie kategorie', searchBtn: 'Znajdź konkurentów',
      trackedLabel: 'Już śledzony', suggestedLabel: 'Sugerowane wyszukiwania',
      openMaps: 'Otwórz w Google Maps', addCompetitor: 'Dodaj konkurenta',
      relatedLabel: 'Powiązane kategorie', tipTitle: 'Jak używać',
      tip1: 'Szukaj firm w Google Maps', tip2: 'Skopiuj adres URL ich strony',
      tip3: 'Dodaj ich jako konkurenta', noLocation: 'Wpisz lokalizację powyżej.',
      mapsQueryNote: 'Otwiera wstępnie wypełnione wyszukiwanie w Google Maps.',
    },
  },
  pt: {
    competitors: { discover: 'Descobrir concorrentes' },
    discover: {
      title: 'Descobrir concorrentes', subtitle: 'Encontre negócios locais para monitorar',
      locationLabel: 'Sua área', locationPlaceholder: 'ex. Lisboa, Porto, Braga',
      categoryLabel: 'Categoria', allCategories: 'Todas as categorias', searchBtn: 'Encontrar concorrentes',
      trackedLabel: 'Já monitorando', suggestedLabel: 'Pesquisas sugeridas',
      openMaps: 'Abrir no Google Maps', addCompetitor: 'Adicionar concorrente',
      relatedLabel: 'Categorias relacionadas', tipTitle: 'Como usar',
      tip1: 'Pesquise negócios no Google Maps', tip2: 'Copie a URL do site deles',
      tip3: 'Adicione-os como concorrente', noLocation: 'Digite uma localização acima.',
      mapsQueryNote: 'Abre uma pesquisa pré-preenchida no Google Maps.',
    },
  },
}

for (const [lang, keys] of Object.entries(additions)) {
  const file = `messages/${lang}.json`
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'))
  // Add to competitors section
  Object.assign(data.dashboard.competitors, keys.competitors)
  // Add new discover section
  data.dashboard.discover = keys.discover
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n')
  console.log('updated', lang)
}
