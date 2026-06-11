const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://rivalkollen.se'

export function buildWeeklyDigestHtml({
  competitors,
  weekStart,
  weekEnd,
}: {
  competitors: Array<{
    name: string
    events: Array<{ summary: string; severity: string }>
  }>
  weekStart: string
  weekEnd: string
}): string {
  const severityColor = (s: string) =>
    s === 'high' ? '#ef4444' : s === 'medium' ? '#fbbf24' : '#60a5fa'

  const competitorRows = competitors
    .filter(c => c.events.length > 0)
    .map(
      c => `
    <div style="margin-bottom:16px;padding:16px 20px;background:#0d1b30;border:1px solid #182b45;border-radius:12px;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td><strong style="color:#dce8ff;font-size:15px;">${escHtml(c.name)}</strong></td>
        <td align="right"><span style="color:#4f74ff;font-size:12px;font-weight:600;">${c.events.length} change${c.events.length !== 1 ? 's' : ''}</span></td>
      </tr></table>
      <div style="margin-top:10px;">
        ${c.events
          .slice(0, 3)
          .map(
            e => `
          <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:7px;">
            <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${severityColor(e.severity)};margin-top:5px;flex-shrink:0;"></span>
            <span style="color:#6b85aa;font-size:13px;">${escHtml(e.summary)}</span>
          </div>`
          )
          .join('')}
        ${c.events.length > 3 ? `<p style="color:#364f6e;font-size:12px;margin:8px 0 0;">+${c.events.length - 3} more changes</p>` : ''}
      </div>
    </div>`
    )
    .join('')

  const hasChanges = competitors.some(c => c.events.length > 0)

  const body = hasChanges
    ? competitorRows
    : `<p style="color:#4d6a8a;font-size:14px;text-align:center;padding:24px 0;">
        No changes detected this week — your competitors are staying quiet.
       </p>`

  return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Rivalkollen — weekly update</title>
</head>
<body style="margin:0;padding:0;background:#07101f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:540px;margin:0 auto;padding:40px 20px;">

    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#dce8ff;font-size:22px;font-weight:700;margin:0 0 4px;letter-spacing:-0.3px;">Rivalkollen</h1>
      <p style="color:#364f6e;font-size:12px;margin:0;">Competitor monitoring</p>
    </div>

    <div style="background:#0b1628;border:1px solid #182b45;border-radius:16px;padding:28px;margin-bottom:24px;">
      <h2 style="color:#dce8ff;font-size:17px;font-weight:600;margin:0 0 4px;">Weekly update</h2>
      <p style="color:#4d6a8a;font-size:13px;margin:0 0 20px;">${weekStart} – ${weekEnd}</p>
      ${body}
    </div>

    <div style="text-align:center;margin-bottom:32px;">
      <a href="${APP_URL}/dashboard"
        style="display:inline-block;background:#4f74ff;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:10px;">
        View dashboard →
      </a>
    </div>

    <p style="color:#364f6e;font-size:11px;text-align:center;line-height:1.6;margin:0;">
      You're receiving this because you have an account at Rivalkollen.<br>
      <a href="${APP_URL}/dashboard/settings" style="color:#4d6a8a;text-decoration:underline;">Manage email settings</a>
    </p>

  </div>
</body>
</html>`
}

function escHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY!,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Rivalkollen', email: process.env.BREVO_SENDER_EMAIL ?? 'noreply@rivalkollen.se' },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Brevo error ${res.status}: ${err}`)
  }
}
