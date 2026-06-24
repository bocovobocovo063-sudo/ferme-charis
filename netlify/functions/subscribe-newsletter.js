const sgMail = process.env.SENDGRID_API_KEY ? require('@sendgrid/mail') : null;

if (sgMail && process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@charisferme.fr';
const adminEmail = process.env.FORM_EMAIL || 'contact@charisferme.fr';

const isValidEmail = (email) => {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const buildAdminEmail = (name, email) => {
  return {
    to: adminEmail,
    from: fromEmail,
    subject: `Nouvel abonnement newsletter - ${name || email}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #111;">
        <h1 style="color: #059669;">Nouvel abonnement newsletter</h1>
        <p>Un visiteur s'est inscrit à la newsletter depuis la page d'accueil.</p>
        <p><strong>Nom :</strong> ${name || 'Non précisé'}</p>
        <p><strong>Email :</strong> ${email}</p>
      </div>
    `
  };
};

const buildUserEmail = (name, email) => {
  return {
    to: email,
    from: fromEmail,
    subject: 'Bienvenue dans la newsletter CHARISFERME',
    html: `
      <div style="font-family: Arial, sans-serif; color: #111;">
        <div style="background: #059669; color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align:center;">
          <h1>Bienvenue chez CHARISFERME</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <p>Bonjour ${name || 'cher ami'},</p>
          <p>Merci pour votre inscription à notre newsletter !</p>
          <p>Vous recevrez bientôt nos actualités, recettes de saison et offres exclusives.</p>
          <p style="margin-top: 20px;">À très vite,<br>CHARISFERME</p>
          <p style="font-size: 12px; color: #6b7280; margin-top: 30px;">Si vous ne souhaitez pas recevoir nos messages, répondez simplement STOP.</p>
        </div>
      </div>
    `
  };
};

const sendEmail = async (message) => {
  if (sgMail && process.env.SENDGRID_API_KEY) {
    await sgMail.send(message);
    return { sent: true, via: 'sendgrid' };
  }

  console.log('SENDGRID non configuré, email newsletter simulé :');
  console.log(message);
  return { sent: false, via: 'console' };
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Méthode non autorisée' })
    };
  }

  let data;
  try {
    data = JSON.parse(event.body || '{}');
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Payload JSON invalide' })
    };
  }

  const name = (data.name || '').trim();
  const email = (data.email || '').trim();

  if (!name) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Le prénom est requis' })
    };
  }

  if (!isValidEmail(email)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Adresse email invalide' })
    };
  }

  try {
    const userMessage = buildUserEmail(name, email);
    const adminMessage = buildAdminEmail(name, email);

    await sendEmail(userMessage);
    await sendEmail(adminMessage);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Inscription enregistrée' })
    };
  } catch (error) {
    console.error('Erreur newsletter:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur serveur, réessayez plus tard' })
    };
  }
};
