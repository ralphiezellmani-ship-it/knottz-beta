export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { email, code, baseUrl } = req.body || {};
    if (!email || !code) {
      res.status(400).json({ error: 'Missing email or code' });
      return;
    }

    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    const senderName = process.env.BREVO_SENDER_NAME || 'Knottz';

    if (!apiKey || !senderEmail) {
      res.status(500).json({ error: 'Missing Brevo configuration' });
      return;
    }

    const inviteLink = `${baseUrl || 'https://knottz-beta.vercel.app'}/?invite=${code}`;

    const payload = {
      sender: { email: senderEmail, name: senderName },
      to: [{ email }],
      subject: 'Du är inbjuden till Knottz Beta',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Välkommen till Knottz Beta</h2>
          <p>Du har blivit inbjuden till Knottz. Klicka på länken nedan för att skapa konto:</p>
          <p><a href="${inviteLink}" style="background:#111827;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;display:inline-block;">Öppna inbjudan</a></p>
          <p>Din inbjudningskod: <strong>${code}</strong></p>
          <p style="color:#6b7280;font-size:12px;">Om knappen inte fungerar, klistra in länken i webbläsaren:<br/>${inviteLink}</p>
        </div>
      `,
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      res.status(502).json({ error: 'Brevo error', details: text });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}
