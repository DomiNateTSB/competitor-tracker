const fs = require('fs')

const t = {
  en: {
    diff:'Diff', removed:'Removed', added:'Added',
    detail:{back:'Back to dashboard',exportCsv:'Export CSV',totalChanges:'Total changes',lastChecked:'Last checked',trackingSince:'Tracking since',historyTitle:'Change history',showDiff:'Show diff',hideDiff:'Hide diff',removed:'Removed',added:'Added',changeRatio:'Change ratio',never:'Never',noChangesTitle:'No changes detected',noChangesDesc:"This competitor's website hasn't changed since you started tracking it. We'll notify you the moment something shifts.",firstCheckTitle:'Run your first check',firstCheckDesc:"Click Check now above to scan this competitor's website and establish a baseline. Future checks will compare against this snapshot.",step1:'Scan website',step2:'Set baseline',step3:'Detect changes',notes:'Notes',notesSaving:'Saving...',notesSaved:'Saved',notesPlaceholder:'Add private notes about this competitor...'}
  },
  sv: {
    diff:'Diff', removed:'Borttaget', added:'Tillagt',
    detail:{back:'Tillbaka till dashboard',exportCsv:'Exportera CSV',totalChanges:'Totala ändringar',lastChecked:'Senast kontrollerad',trackingSince:'Spårar sedan',historyTitle:'Ändringshistorik',showDiff:'Visa diff',hideDiff:'Dölj diff',removed:'Borttaget',added:'Tillagt',changeRatio:'Förändringsgrad',never:'Aldrig',noChangesTitle:'Inga ändringar hittade',noChangesDesc:'Den här konkurrentens webbplats har inte ändrats. Vi meddelar dig när något förändras.',firstCheckTitle:'Kör din första kontroll',firstCheckDesc:'Klicka på Kontrollera nu för att skanna webbplatsen och sätta en baslinje. Framtida kontroller jämförs mot denna.',step1:'Skanna webbplats',step2:'Sätt baslinje',step3:'Hitta ändringar',notes:'Anteckningar',notesSaving:'Sparar...',notesSaved:'Sparat',notesPlaceholder:'Lägg till privata anteckningar om den här konkurrenten...'}
  },
  da: {
    diff:'Diff', removed:'Fjernet', added:'Tilføjet',
    detail:{back:'Tilbage til dashboard',exportCsv:'Eksporter CSV',totalChanges:'Samlede ændringer',lastChecked:'Sidst kontrolleret',trackingSince:'Sporer siden',historyTitle:'Ændringshistorik',showDiff:'Vis diff',hideDiff:'Skjul diff',removed:'Fjernet',added:'Tilføjet',changeRatio:'Ændringsgrad',never:'Aldrig',noChangesTitle:'Ingen ændringer fundet',noChangesDesc:'Denne konkurrents hjemmeside har ikke ændret sig. Vi giver dig besked, når noget ændres.',firstCheckTitle:'Kør din første kontrol',firstCheckDesc:'Klik på Kontrollér nu for at scanne hjemmesiden og oprette en baseline.',step1:'Scan hjemmeside',step2:'Opret baseline',step3:'Find ændringer',notes:'Noter',notesSaving:'Gemmer...',notesSaved:'Gemt',notesPlaceholder:'Tilføj private noter om denne konkurrent...'}
  },
  de: {
    diff:'Diff', removed:'Entfernt', added:'Hinzugefügt',
    detail:{back:'Zurück zum Dashboard',exportCsv:'CSV exportieren',totalChanges:'Änderungen gesamt',lastChecked:'Zuletzt geprüft',trackingSince:'Beobachtet seit',historyTitle:'Änderungsverlauf',showDiff:'Diff anzeigen',hideDiff:'Diff ausblenden',removed:'Entfernt',added:'Hinzugefügt',changeRatio:'Änderungsrate',never:'Nie',noChangesTitle:'Keine Änderungen erkannt',noChangesDesc:'Die Website dieses Konkurrenten hat sich nicht verändert. Wir benachrichtigen Sie, sobald sich etwas ändert.',firstCheckTitle:'Ersten Check durchführen',firstCheckDesc:'Klicken Sie auf Jetzt prüfen, um die Website zu scannen und eine Baseline zu erstellen.',step1:'Website scannen',step2:'Baseline setzen',step3:'Änderungen erkennen',notes:'Notizen',notesSaving:'Speichern...',notesSaved:'Gespeichert',notesPlaceholder:'Private Notizen über diesen Konkurrenten hinzufügen...'}
  },
  es: {
    diff:'Diff', removed:'Eliminado', added:'Agregado',
    detail:{back:'Volver al panel',exportCsv:'Exportar CSV',totalChanges:'Total de cambios',lastChecked:'Última comprobación',trackingSince:'Siguiendo desde',historyTitle:'Historial de cambios',showDiff:'Ver diff',hideDiff:'Ocultar diff',removed:'Eliminado',added:'Agregado',changeRatio:'Tasa de cambio',never:'Nunca',noChangesTitle:'Sin cambios detectados',noChangesDesc:'El sitio web de este competidor no ha cambiado. Te notificaremos cuando algo cambie.',firstCheckTitle:'Realiza tu primera comprobación',firstCheckDesc:'Haz clic en Comprobar ahora para escanear el sitio y establecer una línea base.',step1:'Escanear web',step2:'Establecer base',step3:'Detectar cambios',notes:'Notas',notesSaving:'Guardando...',notesSaved:'Guardado',notesPlaceholder:'Agrega notas privadas sobre este competidor...'}
  },
  fi: {
    diff:'Diff', removed:'Poistettu', added:'Lisätty',
    detail:{back:'Takaisin kojelautaan',exportCsv:'Vie CSV',totalChanges:'Muutokset yhteensä',lastChecked:'Viimeksi tarkistettu',trackingSince:'Seuranta alkaen',historyTitle:'Muutoshistoria',showDiff:'Näytä diff',hideDiff:'Piilota diff',removed:'Poistettu',added:'Lisätty',changeRatio:'Muutossuhde',never:'Ei koskaan',noChangesTitle:'Muutoksia ei havaittu',noChangesDesc:'Tämän kilpailijan verkkosivusto ei ole muuttunut. Ilmoitamme sinulle, kun jotain muuttuu.',firstCheckTitle:'Suorita ensimmäinen tarkistus',firstCheckDesc:'Napsauta Tarkista nyt skannataksesi sivuston ja luodaksesi perusviivan.',step1:'Skannaa sivusto',step2:'Aseta perusviiva',step3:'Havaitse muutokset',notes:'Muistiinpanot',notesSaving:'Tallennetaan...',notesSaved:'Tallennettu',notesPlaceholder:'Lisää yksityisiä muistiinpanoja tästä kilpailijasta...'}
  },
  fr: {
    diff:'Diff', removed:'Supprimé', added:'Ajouté',
    detail:{back:'Retour au tableau de bord',exportCsv:'Exporter CSV',totalChanges:'Total des changements',lastChecked:'Dernière vérification',trackingSince:'Suivi depuis',historyTitle:'Historique des changements',showDiff:'Afficher le diff',hideDiff:'Masquer le diff',removed:'Supprimé',added:'Ajouté',changeRatio:'Taux de changement',never:'Jamais',noChangesTitle:'Aucun changement détecté',noChangesDesc:"Le site de ce concurrent n'a pas changé. Nous vous informerons dès qu'un changement sera détecté.",firstCheckTitle:'Effectuez votre première vérification',firstCheckDesc:'Cliquez sur Vérifier maintenant pour analyser le site et établir une référence.',step1:'Scanner le site',step2:'Établir la référence',step3:'Détecter les changements',notes:'Notes',notesSaving:'Enregistrement...',notesSaved:'Enregistré',notesPlaceholder:'Ajoutez des notes privées sur ce concurrent...'}
  },
  it: {
    diff:'Diff', removed:'Rimosso', added:'Aggiunto',
    detail:{back:'Torna alla dashboard',exportCsv:'Esporta CSV',totalChanges:'Modifiche totali',lastChecked:'Ultima verifica',trackingSince:'Monitoraggio da',historyTitle:'Cronologia modifiche',showDiff:'Mostra diff',hideDiff:'Nascondi diff',removed:'Rimosso',added:'Aggiunto',changeRatio:'Percentuale modifica',never:'Mai',noChangesTitle:'Nessuna modifica rilevata',noChangesDesc:'Il sito di questo concorrente non è cambiato. Ti avviseremo appena qualcosa cambierà.',firstCheckTitle:'Esegui il primo controllo',firstCheckDesc:'Fai clic su Controlla ora per scansionare il sito e stabilire una baseline.',step1:'Scansiona il sito',step2:'Stabilisci baseline',step3:'Rileva modifiche',notes:'Note',notesSaving:'Salvataggio...',notesSaved:'Salvato',notesPlaceholder:'Aggiungi note private su questo concorrente...'}
  },
  nl: {
    diff:'Diff', removed:'Verwijderd', added:'Toegevoegd',
    detail:{back:'Terug naar dashboard',exportCsv:'CSV exporteren',totalChanges:'Totale wijzigingen',lastChecked:'Laatst gecontroleerd',trackingSince:'Gevolgd sinds',historyTitle:'Wijzigingsgeschiedenis',showDiff:'Diff tonen',hideDiff:'Diff verbergen',removed:'Verwijderd',added:'Toegevoegd',changeRatio:'Wijzigingsverhouding',never:'Nooit',noChangesTitle:'Geen wijzigingen gedetecteerd',noChangesDesc:'De website van deze concurrent is niet gewijzigd. We waarschuwen je zodra er iets verandert.',firstCheckTitle:'Voer de eerste controle uit',firstCheckDesc:'Klik op Nu controleren om de website te scannen en een basislijn in te stellen.',step1:'Website scannen',step2:'Basislijn instellen',step3:'Wijzigingen detecteren',notes:'Notities',notesSaving:'Opslaan...',notesSaved:'Opgeslagen',notesPlaceholder:'Voeg privénotities toe over deze concurrent...'}
  },
  no: {
    diff:'Diff', removed:'Fjernet', added:'Lagt til',
    detail:{back:'Tilbake til dashbord',exportCsv:'Eksporter CSV',totalChanges:'Totale endringer',lastChecked:'Sist kontrollert',trackingSince:'Sporer siden',historyTitle:'Endringshistorikk',showDiff:'Vis diff',hideDiff:'Skjul diff',removed:'Fjernet',added:'Lagt til',changeRatio:'Endringsgrad',never:'Aldri',noChangesTitle:'Ingen endringer funnet',noChangesDesc:'Denne konkurrentens nettside har ikke endret seg. Vi varsler deg når noe endres.',firstCheckTitle:'Kjør din første sjekk',firstCheckDesc:'Klikk Sjekk nå for å skanne nettsiden og opprette en grunnlinje.',step1:'Skann nettside',step2:'Opprett grunnlinje',step3:'Finn endringer',notes:'Notater',notesSaving:'Lagrer...',notesSaved:'Lagret',notesPlaceholder:'Legg til private notater om denne konkurrenten...'}
  },
  pl: {
    diff:'Diff', removed:'Usunięto', added:'Dodano',
    detail:{back:'Powrót do pulpitu',exportCsv:'Eksportuj CSV',totalChanges:'Łączne zmiany',lastChecked:'Ostatnio sprawdzono',trackingSince:'Śledzenie od',historyTitle:'Historia zmian',showDiff:'Pokaż diff',hideDiff:'Ukryj diff',removed:'Usunięto',added:'Dodano',changeRatio:'Współczynnik zmian',never:'Nigdy',noChangesTitle:'Nie wykryto zmian',noChangesDesc:'Strona tego konkurenta nie zmieniła się. Powiadomimy Cię, gdy coś się zmieni.',firstCheckTitle:'Uruchom pierwsze sprawdzanie',firstCheckDesc:'Kliknij Sprawdź teraz, aby zeskanować stronę i ustalić punkt odniesienia.',step1:'Skanuj stronę',step2:'Ustal punkt odniesienia',step3:'Wykryj zmiany',notes:'Notatki',notesSaving:'Zapisywanie...',notesSaved:'Zapisano',notesPlaceholder:'Dodaj prywatne notatki o tym konkurencie...'}
  },
  pt: {
    diff:'Diff', removed:'Removido', added:'Adicionado',
    detail:{back:'Voltar ao painel',exportCsv:'Exportar CSV',totalChanges:'Total de alterações',lastChecked:'Última verificação',trackingSince:'Rastreando desde',historyTitle:'Histórico de alterações',showDiff:'Ver diff',hideDiff:'Ocultar diff',removed:'Removido',added:'Adicionado',changeRatio:'Taxa de alteração',never:'Nunca',noChangesTitle:'Nenhuma alteração detectada',noChangesDesc:'O site deste concorrente não mudou. Vamos notificá-lo quando algo mudar.',firstCheckTitle:'Execute sua primeira verificação',firstCheckDesc:'Clique em Verificar agora para escanear o site e estabelecer uma linha de base.',step1:'Escanear site',step2:'Estabelecer base',step3:'Detectar alterações',notes:'Notas',notesSaving:'Salvando...',notesSaved:'Salvo',notesPlaceholder:'Adicione notas privadas sobre este concorrente...'}
  }
}

for (const [lang, keys] of Object.entries(t)) {
  const file = `messages/${lang}.json`
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'))
  data.dashboard.competitors.diff = keys.diff
  data.dashboard.competitors.removed = keys.removed
  data.dashboard.competitors.added = keys.added
  data.dashboard.detail = keys.detail
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n')
  console.log('updated', lang)
}
