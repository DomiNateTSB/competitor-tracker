const fs = require('fs')

const additions = {
  en: {
    competitors: {
      checkAll: 'Check all now', checkingAll: 'Checking…', allChecked: 'All checked',
      search: 'Search competitors…', sortBy: 'Sort by', sortRecent: 'Recently added',
      sortChanged: 'Most changes', sortChecked: 'Last checked', sortName: 'Name',
      filterAll: 'All categories', noResults: 'No competitors match your search.',
      markReviewed: 'Mark reviewed', reviewed: 'Reviewed', loadMore: 'Load more',
      unreviewedChanges: 'unreviewed changes', activityLabel: 'Activity',
      notifTitle: 'Recent changes', notifEmpty: 'No changes detected yet.',
    },
  },
  sv: {
    competitors: {
      checkAll: 'Kontrollera alla', checkingAll: 'Kontrollerar…', allChecked: 'Alla kontrollerade',
      search: 'Sök konkurrenter…', sortBy: 'Sortera efter', sortRecent: 'Senast tillagda',
      sortChanged: 'Flest ändringar', sortChecked: 'Senast kontrollerad', sortName: 'Namn',
      filterAll: 'Alla kategorier', noResults: 'Inga konkurrenter matchar din sökning.',
      markReviewed: 'Markera granskad', reviewed: 'Granskad', loadMore: 'Visa fler',
      unreviewedChanges: 'ogranskade ändringar', activityLabel: 'Aktivitet',
      notifTitle: 'Senaste ändringar', notifEmpty: 'Inga ändringar har upptäckts ännu.',
    },
  },
  da: {
    competitors: {
      checkAll: 'Kontroller alle', checkingAll: 'Kontrollerer…', allChecked: 'Alle kontrolleret',
      search: 'Søg konkurrenter…', sortBy: 'Sorter efter', sortRecent: 'Senest tilføjet',
      sortChanged: 'Flest ændringer', sortChecked: 'Senest kontrolleret', sortName: 'Navn',
      filterAll: 'Alle kategorier', noResults: 'Ingen konkurrenter matcher din søgning.',
      markReviewed: 'Marker gennemgået', reviewed: 'Gennemgået', loadMore: 'Indlæs flere',
      unreviewedChanges: 'ugennemgåede ændringer', activityLabel: 'Aktivitet',
      notifTitle: 'Seneste ændringer', notifEmpty: 'Ingen ændringer opdaget endnu.',
    },
  },
  de: {
    competitors: {
      checkAll: 'Alle prüfen', checkingAll: 'Wird geprüft…', allChecked: 'Alle geprüft',
      search: 'Wettbewerber suchen…', sortBy: 'Sortieren nach', sortRecent: 'Zuletzt hinzugefügt',
      sortChanged: 'Meiste Änderungen', sortChecked: 'Zuletzt geprüft', sortName: 'Name',
      filterAll: 'Alle Kategorien', noResults: 'Keine Wettbewerber entsprechen Ihrer Suche.',
      markReviewed: 'Als überprüft markieren', reviewed: 'Überprüft', loadMore: 'Mehr laden',
      unreviewedChanges: 'ungeprüfte Änderungen', activityLabel: 'Aktivität',
      notifTitle: 'Neueste Änderungen', notifEmpty: 'Noch keine Änderungen erkannt.',
    },
  },
  es: {
    competitors: {
      checkAll: 'Verificar todos', checkingAll: 'Verificando…', allChecked: 'Todos verificados',
      search: 'Buscar competidores…', sortBy: 'Ordenar por', sortRecent: 'Añadidos recientemente',
      sortChanged: 'Más cambios', sortChecked: 'Última verificación', sortName: 'Nombre',
      filterAll: 'Todas las categorías', noResults: 'Ningún competidor coincide con tu búsqueda.',
      markReviewed: 'Marcar como revisado', reviewed: 'Revisado', loadMore: 'Cargar más',
      unreviewedChanges: 'cambios sin revisar', activityLabel: 'Actividad',
      notifTitle: 'Cambios recientes', notifEmpty: 'No se han detectado cambios aún.',
    },
  },
  fi: {
    competitors: {
      checkAll: 'Tarkista kaikki', checkingAll: 'Tarkistetaan…', allChecked: 'Kaikki tarkistettu',
      search: 'Hae kilpailijoita…', sortBy: 'Lajittele', sortRecent: 'Viimeksi lisätty',
      sortChanged: 'Eniten muutoksia', sortChecked: 'Viimeksi tarkistettu', sortName: 'Nimi',
      filterAll: 'Kaikki kategoriat', noResults: 'Ei kilpailijoita hakuehdoilla.',
      markReviewed: 'Merkitse tarkistetuksi', reviewed: 'Tarkistettu', loadMore: 'Lataa lisää',
      unreviewedChanges: 'tarkistamattomat muutokset', activityLabel: 'Aktiivisuus',
      notifTitle: 'Viimeisimmät muutokset', notifEmpty: 'Muutoksia ei ole havaittu vielä.',
    },
  },
  fr: {
    competitors: {
      checkAll: 'Tout vérifier', checkingAll: 'Vérification…', allChecked: 'Tout vérifié',
      search: 'Rechercher des concurrents…', sortBy: 'Trier par', sortRecent: 'Ajoutés récemment',
      sortChanged: 'Plus de changements', sortChecked: 'Dernière vérification', sortName: 'Nom',
      filterAll: 'Toutes catégories', noResults: 'Aucun concurrent ne correspond à votre recherche.',
      markReviewed: 'Marquer comme revu', reviewed: 'Revu', loadMore: 'Charger plus',
      unreviewedChanges: 'changements non revus', activityLabel: 'Activité',
      notifTitle: 'Changements récents', notifEmpty: 'Aucun changement détecté pour l\'instant.',
    },
  },
  it: {
    competitors: {
      checkAll: 'Controlla tutti', checkingAll: 'Controllo…', allChecked: 'Tutti controllati',
      search: 'Cerca concorrenti…', sortBy: 'Ordina per', sortRecent: 'Aggiunti di recente',
      sortChanged: 'Più modifiche', sortChecked: 'Ultimo controllo', sortName: 'Nome',
      filterAll: 'Tutte le categorie', noResults: 'Nessun concorrente corrisponde alla ricerca.',
      markReviewed: 'Segna come revisionato', reviewed: 'Revisionato', loadMore: 'Carica altri',
      unreviewedChanges: 'modifiche non revisionate', activityLabel: 'Attività',
      notifTitle: 'Modifiche recenti', notifEmpty: 'Nessuna modifica rilevata ancora.',
    },
  },
  nl: {
    competitors: {
      checkAll: 'Alles controleren', checkingAll: 'Controleren…', allChecked: 'Alles gecontroleerd',
      search: 'Concurrenten zoeken…', sortBy: 'Sorteren op', sortRecent: 'Recent toegevoegd',
      sortChanged: 'Meeste wijzigingen', sortChecked: 'Laatst gecontroleerd', sortName: 'Naam',
      filterAll: 'Alle categorieën', noResults: 'Geen concurrenten gevonden.',
      markReviewed: 'Markeer als bekeken', reviewed: 'Bekeken', loadMore: 'Meer laden',
      unreviewedChanges: 'onbekeken wijzigingen', activityLabel: 'Activiteit',
      notifTitle: 'Recente wijzigingen', notifEmpty: 'Nog geen wijzigingen gedetecteerd.',
    },
  },
  no: {
    competitors: {
      checkAll: 'Sjekk alle', checkingAll: 'Sjekker…', allChecked: 'Alle sjekket',
      search: 'Søk konkurrenter…', sortBy: 'Sorter etter', sortRecent: 'Nylig lagt til',
      sortChanged: 'Flest endringer', sortChecked: 'Sist sjekket', sortName: 'Navn',
      filterAll: 'Alle kategorier', noResults: 'Ingen konkurrenter matcher søket.',
      markReviewed: 'Merk som gjennomgått', reviewed: 'Gjennomgått', loadMore: 'Last inn flere',
      unreviewedChanges: 'ugjennomgåtte endringer', activityLabel: 'Aktivitet',
      notifTitle: 'Siste endringer', notifEmpty: 'Ingen endringer oppdaget ennå.',
    },
  },
  pl: {
    competitors: {
      checkAll: 'Sprawdź wszystkie', checkingAll: 'Sprawdzanie…', allChecked: 'Wszystkie sprawdzone',
      search: 'Szukaj konkurentów…', sortBy: 'Sortuj według', sortRecent: 'Ostatnio dodane',
      sortChanged: 'Najwięcej zmian', sortChecked: 'Ostatnio sprawdzone', sortName: 'Nazwa',
      filterAll: 'Wszystkie kategorie', noResults: 'Brak konkurentów pasujących do wyszukiwania.',
      markReviewed: 'Oznacz jako przejrzane', reviewed: 'Przejrzane', loadMore: 'Wczytaj więcej',
      unreviewedChanges: 'nieprzejrzane zmiany', activityLabel: 'Aktywność',
      notifTitle: 'Ostatnie zmiany', notifEmpty: 'Nie wykryto jeszcze żadnych zmian.',
    },
  },
  pt: {
    competitors: {
      checkAll: 'Verificar todos', checkingAll: 'Verificando…', allChecked: 'Todos verificados',
      search: 'Pesquisar concorrentes…', sortBy: 'Ordenar por', sortRecent: 'Adicionados recentemente',
      sortChanged: 'Mais alterações', sortChecked: 'Última verificação', sortName: 'Nome',
      filterAll: 'Todas as categorias', noResults: 'Nenhum concorrente corresponde à pesquisa.',
      markReviewed: 'Marcar como revisado', reviewed: 'Revisado', loadMore: 'Carregar mais',
      unreviewedChanges: 'alterações não revisadas', activityLabel: 'Atividade',
      notifTitle: 'Alterações recentes', notifEmpty: 'Nenhuma alteração detectada ainda.',
    },
  },
}

for (const [lang, keys] of Object.entries(additions)) {
  const file = `messages/${lang}.json`
  const data = JSON.parse(require('fs').readFileSync(file, 'utf-8'))
  Object.assign(data.dashboard.competitors, keys.competitors)
  require('fs').writeFileSync(file, JSON.stringify(data, null, 2) + '\n')
  console.log('updated', lang)
}
