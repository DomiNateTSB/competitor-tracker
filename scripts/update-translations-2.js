const fs = require('fs')

// New keys to add to dashboard.competitors and dashboard.detail
const additions = {
  en: {
    competitors: { statusOk: 'Active', statusError: 'Check failed', statusNever: 'Not checked yet' },
    detail: { alertsTitle: 'Alert preferences', alertsEnabled: 'Email alerts', alertsSeverity: 'Alert on', alertsAll: 'All changes', alertsMediumHigh: 'Medium & high', alertsHighOnly: 'High only', share: 'Share report', shareCopied: 'Link copied!', shareRevoke: 'Revoke link' }
  },
  sv: {
    competitors: { statusOk: 'Aktiv', statusError: 'Kontroll misslyckades', statusNever: 'Ej kontrollerad' },
    detail: { alertsTitle: 'Aviseringsinställningar', alertsEnabled: 'E-postaviseringar', alertsSeverity: 'Avisera vid', alertsAll: 'Alla ändringar', alertsMediumHigh: 'Medel och hög', alertsHighOnly: 'Hög allvarlighet', share: 'Dela rapport', shareCopied: 'Länk kopierad!', shareRevoke: 'Ta bort länk' }
  },
  da: {
    competitors: { statusOk: 'Aktiv', statusError: 'Kontrol mislykkedes', statusNever: 'Ikke kontrolleret' },
    detail: { alertsTitle: 'Notifikationsindstillinger', alertsEnabled: 'E-mailnotifikationer', alertsSeverity: 'Notificer ved', alertsAll: 'Alle ændringer', alertsMediumHigh: 'Mellem og høj', alertsHighOnly: 'Kun høj', share: 'Del rapport', shareCopied: 'Link kopieret!', shareRevoke: 'Fjern link' }
  },
  de: {
    competitors: { statusOk: 'Aktiv', statusError: 'Prüfung fehlgeschlagen', statusNever: 'Noch nicht geprüft' },
    detail: { alertsTitle: 'Benachrichtigungseinstellungen', alertsEnabled: 'E-Mail-Benachrichtigungen', alertsSeverity: 'Benachrichtigen bei', alertsAll: 'Allen Änderungen', alertsMediumHigh: 'Mittel & hoch', alertsHighOnly: 'Nur hoch', share: 'Bericht teilen', shareCopied: 'Link kopiert!', shareRevoke: 'Link entfernen' }
  },
  es: {
    competitors: { statusOk: 'Activo', statusError: 'Comprobación fallida', statusNever: 'Sin comprobar' },
    detail: { alertsTitle: 'Preferencias de alertas', alertsEnabled: 'Alertas por email', alertsSeverity: 'Alertar en', alertsAll: 'Todos los cambios', alertsMediumHigh: 'Medio y alto', alertsHighOnly: 'Solo alto', share: 'Compartir informe', shareCopied: '¡Enlace copiado!', shareRevoke: 'Eliminar enlace' }
  },
  fi: {
    competitors: { statusOk: 'Aktiivinen', statusError: 'Tarkistus epäonnistui', statusNever: 'Ei tarkistettu' },
    detail: { alertsTitle: 'Ilmoitusasetukset', alertsEnabled: 'Sähköposti-ilmoitukset', alertsSeverity: 'Ilmoita muutoksesta', alertsAll: 'Kaikki muutokset', alertsMediumHigh: 'Keskitaso ja korkea', alertsHighOnly: 'Vain korkea', share: 'Jaa raportti', shareCopied: 'Linkki kopioitu!', shareRevoke: 'Poista linkki' }
  },
  fr: {
    competitors: { statusOk: 'Actif', statusError: 'Vérification échouée', statusNever: 'Pas encore vérifié' },
    detail: { alertsTitle: 'Préférences d\'alertes', alertsEnabled: 'Alertes par email', alertsSeverity: 'Alerter sur', alertsAll: 'Tous les changements', alertsMediumHigh: 'Moyen et élevé', alertsHighOnly: 'Élevé seulement', share: 'Partager le rapport', shareCopied: 'Lien copié !', shareRevoke: 'Supprimer le lien' }
  },
  it: {
    competitors: { statusOk: 'Attivo', statusError: 'Verifica fallita', statusNever: 'Non verificato' },
    detail: { alertsTitle: 'Preferenze avvisi', alertsEnabled: 'Avvisi email', alertsSeverity: 'Avvisa per', alertsAll: 'Tutte le modifiche', alertsMediumHigh: 'Medio e alto', alertsHighOnly: 'Solo alto', share: 'Condividi report', shareCopied: 'Link copiato!', shareRevoke: 'Rimuovi link' }
  },
  nl: {
    competitors: { statusOk: 'Actief', statusError: 'Controle mislukt', statusNever: 'Nog niet gecontroleerd' },
    detail: { alertsTitle: 'Meldingsinstellingen', alertsEnabled: 'E-mailmeldingen', alertsSeverity: 'Melden bij', alertsAll: 'Alle wijzigingen', alertsMediumHigh: 'Middel en hoog', alertsHighOnly: 'Alleen hoog', share: 'Rapport delen', shareCopied: 'Link gekopieerd!', shareRevoke: 'Link verwijderen' }
  },
  no: {
    competitors: { statusOk: 'Aktiv', statusError: 'Sjekk mislyktes', statusNever: 'Ikke sjekket' },
    detail: { alertsTitle: 'Varslingsinnstillinger', alertsEnabled: 'E-postvarsler', alertsSeverity: 'Varsle ved', alertsAll: 'Alle endringer', alertsMediumHigh: 'Middels og høy', alertsHighOnly: 'Kun høy', share: 'Del rapport', shareCopied: 'Lenke kopiert!', shareRevoke: 'Fjern lenke' }
  },
  pl: {
    competitors: { statusOk: 'Aktywny', statusError: 'Sprawdzanie nie powiodło się', statusNever: 'Nie sprawdzono' },
    detail: { alertsTitle: 'Preferencje alertów', alertsEnabled: 'Alerty e-mail', alertsSeverity: 'Alertuj przy', alertsAll: 'Wszystkich zmianach', alertsMediumHigh: 'Średnim i wysokim', alertsHighOnly: 'Tylko wysokim', share: 'Udostępnij raport', shareCopied: 'Link skopiowany!', shareRevoke: 'Usuń link' }
  },
  pt: {
    competitors: { statusOk: 'Ativo', statusError: 'Verificação falhou', statusNever: 'Não verificado' },
    detail: { alertsTitle: 'Preferências de alertas', alertsEnabled: 'Alertas por email', alertsSeverity: 'Alertar em', alertsAll: 'Todas as alterações', alertsMediumHigh: 'Médio e alto', alertsHighOnly: 'Apenas alto', share: 'Compartilhar relatório', shareCopied: 'Link copiado!', shareRevoke: 'Remover link' }
  },
}

for (const [lang, keys] of Object.entries(additions)) {
  const file = `messages/${lang}.json`
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'))
  Object.assign(data.dashboard.competitors, keys.competitors)
  Object.assign(data.dashboard.detail, keys.detail)
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n')
  console.log('updated', lang)
}
