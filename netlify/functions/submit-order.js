// Fonction Netlify pour traiter les commandes simples (sans paiement)
// Utilisation: Produits panier ou devis sans paiement Stripe
// Support: SendGrid API ou SMTP (Gmail, etc.)

const sgMail = process.env.SENDGRID_API_KEY ? require('@sendgrid/mail') : null;

// Configurer SendGrid si clé disponible
if (sgMail && process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// ===== SEND EMAILS FUNCTION =====
async function sendEmails(toEmail, toName, commandeId, itemsList, totalAmount, emailHTML, clientEmailHTML) {
  try {
    // Mode 1: SendGrid (priorité)
    if (sgMail && process.env.SENDGRID_API_KEY) {
      console.log('📧 Envoi via SendGrid...');
      await sgMail.send([
        {
          to: 'contact@charisferme.fr',
          from: process.env.SENDGRID_FROM_EMAIL || 'noreply@charisferme.fr',
          subject: `🛒 Nouvelle commande - ${commandeId}`,
          html: emailHTML
        },
        {
          to: toEmail,
          from: process.env.SENDGRID_FROM_EMAIL || 'noreply@charisferme.fr',
          subject: `✅ Votre commande ${commandeId} a été reçue`,
          html: clientEmailHTML
        }
      ]);
      return { sent: true, via: 'SendGrid' };
    }

    // Mode 2: Log seulement (fallback - pour tests locaux)
    console.log('⚠️ SendGrid non configuré - Mode console seulement');
    console.log('📧 Email à contact@charisferme.fr:');
    console.log(emailHTML);
    console.log('\n📧 Email au client ' + toEmail + ':');
    console.log(clientEmailHTML);
    return { sent: false, via: 'console_log' };

  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    throw error;
  }
}

exports.handler = async (event) => {
  // Seulement POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Méthode non autorisée' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { name, email, phone, address, date, message, items, type } = data;

    // Validation basique
    if (!name || !email || !phone || !items || items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Données manquantes (name, email, phone, items requis)' })
      };
    }

    // Générer ID commande
    const commandeId = 'CMD-' + Date.now();

    // Construire contenu email
    const itemsList = items.map(item => 
      `• ${item.name}${item.emoji ? ' ' + item.emoji : ''} × ${item.qty || 1}${item.price ? ' = €' + (item.price * (item.qty || 1)).toFixed(2) : ''}`
    ).join('\n');

    const totalAmount = items.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 1)), 0);

    // Email HTML formaté pour le gestionnaire
    const emailHTML = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; background: #f9fafb; padding: 20px;">
        
        <!-- En-tête -->
        <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🛒 NOUVELLE COMMANDE</h1>
          <p style="margin: 10px 0 0; opacity: 0.9;">CHARISFERME</p>
        </div>

        <!-- Info commande -->
        <div style="background: white; padding: 20px; border-bottom: 1px solid #e5e7eb;">
          <table style="width: 100%; font-size: 14px;">
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 8px 0; font-weight: bold; color: #059669;">ID Commande:</td>
              <td style="padding: 8px 0; text-align: right; font-family: monospace; font-weight: bold;">${commandeId}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 8px 0; font-weight: bold; color: #059669;">Type:</td>
              <td style="padding: 8px 0; text-align: right;">${type === 'devis' ? '📋 Demande de devis' : '🛒 Commande panier'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #059669;">Date/Heure:</td>
              <td style="padding: 8px 0; text-align: right;">${new Date().toLocaleString('fr-FR')}</td>
            </tr>
          </table>
        </div>

        <!-- Détails client -->
        <div style="background: white; padding: 20px; border-bottom: 1px solid #e5e7eb;">
          <h3 style="margin: 0 0 15px; color: #059669; font-size: 16px;">👤 Détails Client</h3>
          <table style="width: 100%; font-size: 14px; line-height: 1.8;">
            <tr>
              <td style="font-weight: bold; color: #374151; width: 100px;">Nom:</td>
              <td>${name}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; color: #374151;">Email:</td>
              <td><a href="mailto:${email}" style="color: #059669; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="font-weight: bold; color: #374151;">Tél.:</td>
              <td><a href="tel:${phone}" style="color: #059669; text-decoration: none;">${phone}</a></td>
            </tr>
            ${address ? `<tr><td style="font-weight: bold; color: #374151; vertical-align: top;">Adresse:</td><td>${address}</td></tr>` : ''}
            ${date ? `<tr><td style="font-weight: bold; color: #374151;">Date demandée:</td><td>${date}</td></tr>` : ''}
          </table>
        </div>

        <!-- Articles -->
        <div style="background: white; padding: 20px; border-bottom: 1px solid #e5e7eb;">
          <h3 style="margin: 0 0 15px; color: #059669; font-size: 16px;">🛍️ Articles Commandés</h3>
          <table style="width: 100%; font-size: 14px;">
            ${items.map((item, i) => `
            <tr style="border-bottom: 1px solid #f3f4f6; padding: 10px 0;">
              <td style="padding: 10px 0;">
                <span style="font-size: 18px; margin-right: 10px;">${item.emoji || '📦'}</span>
                <strong>${item.name}</strong>
              </td>
              <td style="padding: 10px 0; text-align: right;">
                <span style="background: #f3f4f6; padding: 3px 8px; border-radius: 4px;">× ${item.qty || 1}</span>
                ${item.price ? `<br><span style="color: #059669; font-weight: bold;">€${(item.price * (item.qty || 1)).toFixed(2)}</span>` : ''}
              </td>
            </tr>
            `).join('')}
          </table>
        </div>

        <!-- Total -->
        ${totalAmount > 0 ? `
        <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); padding: 20px; border-bottom: 1px solid #e5e7eb;">
          <table style="width: 100%;">
            <tr style="font-size: 18px;">
              <td style="font-weight: bold; color: #059669;">💰 Total TTC:</td>
              <td style="text-align: right; font-weight: bold; color: #059669; font-size: 24px;">€${totalAmount.toFixed(2).replace('.', ',')}</td>
            </tr>
          </table>
        </div>
        ` : ''}

        ${message ? `
        <div style="background: white; padding: 20px; border-bottom: 1px solid #e5e7eb;">
          <h3 style="margin: 0 0 10px; color: #059669; font-size: 14px;">💬 Message du client:</h3>
          <p style="margin: 0; background: #f9fafb; padding: 15px; border-left: 3px solid #059669; white-space: pre-wrap; word-wrap: break-word; font-size: 14px; line-height: 1.6;">${message}</p>
        </div>
        ` : ''}

        <!-- Action -->
        <div style="background: white; padding: 20px; border-radius: 0 0 10px 10px; border-top: 1px solid #e5e7eb;">
          <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 15px; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-weight: bold; color: #b45309;">✉️ À FAIRE IMMÉDIATEMENT:</p>
            <p style="margin: 10px 0 0; font-size: 14px; color: #92400e;">
              1️⃣ Appeler <strong>${name}</strong> au <strong>${phone}</strong><br>
              2️⃣ Confirmer les détails<br>
              3️⃣ Organiser la livraison
            </p>
          </div>
        </div>

        <!-- Pied -->
        <div style="text-align: center; padding: 20px; font-size: 12px; color: #6b7280;">
          <p style="margin: 0;">CHARISFERME • Ferme familiale depuis 2001</p>
          <p style="margin: 5px 0 0;"><a href="https://www.charisferme.fr" style="color: #059669; text-decoration: none;">www.charisferme.fr</a></p>
        </div>
      </div>
    `;

    // Email de confirmation au client
    const clientEmailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">✅ Votre ${type === 'devis' ? 'demande de devis' : 'commande'} a bien été reçue</h2>
        
        <p>Merci <strong>${name}</strong> !<br>
        Votre ${type === 'devis' ? 'demande de devis' : 'commande'} a bien été reçue par CHARISFERME.</p>

        <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Votre numéro de réf:</strong> <span style="font-size: 1.2em; color: #059669;">${commandeId}</span></p>
          <p>✓ Conservez ce numéro pour vos échanges</p>
        </div>

        <h3>📦 Récapitulatif de votre ${type === 'devis' ? 'devis' : 'commande'}:</h3>
        <pre style="background: #f9f9f9; padding: 15px; border-left: 3px solid #059669; white-space: pre-wrap;">
${itemsList}
        </pre>

        ${totalAmount > 0 ? `<p style="font-size: 1.1em; font-weight: bold; color: #059669;">💰 Montant: €${totalAmount.toFixed(2).replace('.', ',')}</p>` : ''}

        <div style="background: #eff6ff; border: 1px solid #3b82f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <strong>📧 Prochaines étapes:</strong><br>
          Notre équipe vous contactera sous <strong>24h</strong> (jours ouvrés) pour:<br>
          ✓ Confirmer votre ${type === 'devis' ? 'devis' : 'commande'}<br>
          ✓ Organiser la livraison<br>
          ✓ Traiter le paiement (si nécessaire)
        </div>

        <h3>📞 Questions?</h3>
        <p>
          Téléphone: <strong>06 00 00 00 00</strong><br>
          Email: <strong>contact@charisferme.fr</strong><br>
          WhatsApp: <a href="https://wa.me/33600000000" style="color: #059669;">Cliquez ici</a>
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #666; font-size: 0.9em; text-align: center;">
          CHARISFERME • Ferme familiale • ${new Date().toLocaleDateString('fr-FR')}<br>
          <a href="https://www.charisferme.fr" style="color: #059669; text-decoration: none;">www.charisferme.fr</a>
        </p>
      </div>
    `;

    // Envoyer les emails
    let emailResult = { sent: false, via: 'none' };
    try {
      emailResult = await sendEmails(email, name, commandeId, itemsList, totalAmount, emailHTML, clientEmailHTML);
    } catch (emailErr) {
      console.error('⚠️ Avertissement: Emails non envoyés:', emailErr.message);
      // Continuer même si email échoue - commande reste valide
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        commandeId: commandeId,
        message: `${type === 'devis' ? 'Demande de devis' : 'Commande'} reçue! Nous vous contacterons sous 24h.`,
        email: email,
        name: name,
        emailVia: emailResult.via,
        emailSent: emailResult.sent,
        totalAmount: totalAmount
      })
    };

  } catch (error) {
    console.error('Erreur traitement commande:', error);
    
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: error.message || 'Erreur lors du traitement',
        code: 'SERVER_ERROR'
      })
    };
  }
};
