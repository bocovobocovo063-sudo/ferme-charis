// Fonction Netlify pour traiter les paiements et abonnements Stripe
// Déploiement: Netlify détecte automatiquement ce fichier
// À configurer: Définir STRIPE_SECRET_KEY dans Netlify Build & deploy > Environment

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const sendgridApiKey = process.env.SENDGRID_API_KEY;
const nodemailer = require('nodemailer');

if (!stripeSecretKey) {
  console.error('STRIPE_SECRET_KEY manquante. Configurez-la dans Netlify Build & deploy > Environment.');
}

const stripe = stripeSecretKey ? require('stripe')(stripeSecretKey) : null;

// ===== CONFIG EMAIL (SendGrid ou Nodemailer) =====
let mailService = null;

// Préférer SendGrid si la clé est disponible
if (sendgridApiKey) {
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(sendgridApiKey);
  mailService = { type: 'sendgrid', client: sgMail };
} else {
  // Fallback: Nodemailer avec SMTP (SendGrid ou autre)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'apikey',
      pass: process.env.SMTP_PASS || process.env.SENDGRID_API_KEY || ''
    }
  });
  mailService = { type: 'nodemailer', client: transporter };
}

// ===== SEND EMAIL CONFIRMATION =====
async function sendConfirmationEmail(email, name, orderData) {
  const subject = `Commande CHARISFERME - ${orderData.orderId}`;
  
  // Template HTML professionnel
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #059669, #10b981); color: #fff; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .section { margin: 20px 0; padding: 15px; background: #fff; border-left: 4px solid #059669; border-radius: 4px; }
        .section h2 { margin: 0 0 10px 0; color: #059669; font-size: 18px; }
        .item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .item:last-child { border-bottom: none; }
        .total { font-size: 20px; font-weight: bold; color: #059669; padding: 10px 0; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #666; }
        .btn { display: inline-block; margin-top: 15px; padding: 12px 24px; background: #059669; color: #fff; text-decoration: none; border-radius: 6px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Merci ${name} ! ✅</h1>
          <p>Votre commande a été confirmée</p>
        </div>
        
        <div class="content">
          <div class="section">
            <h2>Récapitulatif de votre commande</h2>
            ${orderData.items.map(item => `
              <div class="item">
                <span><strong>${item.name}</strong> × ${item.qty || 1}</span>
                <span>${item.price ? (item.price * (item.qty || 1)).toFixed(2) + '€' : ''}</span>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <div class="total">Total: ${(orderData.amount / 100).toFixed(2)}€</div>
          </div>

          <div class="section">
            <h2>Numéro de commande</h2>
            <p style="font-size: 18px; color: #059669; font-weight: bold;">${orderData.orderId}</p>
          </div>

          ${orderData.address ? `
          <div class="section">
            <h2>Livraison</h2>
            <p>${orderData.address}</p>
          </div>
          ` : ''}

          ${orderData.frequency ? `
          <div class="section">
            <h2>Détails de l'abonnement</h2>
            <p><strong>Fréquence:</strong> ${orderData.frequency}</p>
            <p>Votre abonnement renouvellera automatiquement selon votre sélection.</p>
          </div>
          ` : ''}

          <div class="section" style="border-left-color: #0891b2;">
            <h2>Prochaines étapes</h2>
            <p>✅ Commande confirmée<br>
               📞 Nous vous recontacterons sous 24h pour confirmer les détails<br>
               🚚 Préparez-vous pour la livraison</p>
            <a href="https://www.charisferme.fr" class="btn">Suivi de votre commande</a>
          </div>

          <div class="footer">
            <p><strong>CHARISFERME</strong><br>
               📧 contact@charisferme.fr<br>
               📞 +33600000000<br>
               🌐 https://www.charisferme.fr</p>
            <p style="margin-top: 15px; color: #999;">Cet email a été envoyé à ${email}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    if (mailService.type === 'sendgrid') {
      // Utiliser SendGrid API
      await mailService.client.send({
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@charisferme.fr',
        subject: subject,
        html: html,
        replyTo: 'contact@charisferme.fr'
      });
      console.log(`Email SendGrid envoyé à ${email}`);
    } else {
      // Utiliser Nodemailer
      await mailService.client.sendMail({
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@charisferme.fr',
        to: email,
        subject: subject,
        html: html,
        replyTo: 'contact@charisferme.fr'
      });
      console.log(`Email Nodemailer envoyé à ${email}`);
    }
  } catch (err) {
    console.error('Erreur envoi email:', err.message);
    // Ne pas faire échouer la commande si l'email échoue
  }
}

// ===== MAIN HANDLER =====
exports.handler = async (event) => {
  if (!stripe) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Stripe non configuré' })
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Méthode non autorisée' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { token, amount, email, name, address, city, postal, phone, orderType, items } = data;

    if (!token || !amount || !email || !name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Données manquantes: token, amount, email, name requis' })
      };
    }

    // ===== CRÉER PAYMENT METHOD =====
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: { token: token }
    });

    // ===== CAS 1: COMMANDE SIMPLE =====
    if (orderType === 'cart') {
      const charge = await stripe.charges.create({
        amount: Math.round(amount),
        currency: 'eur',
        source: token,
        receipt_email: email,
        metadata: {
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          delivery_address: address || city || postal,
          order_type: 'cart'
        }
      });

      const orderId = 'ORD-' + Date.now();

      // Envoyer email de confirmation
      await sendConfirmationEmail(email, name, {
        orderId: orderId,
        amount: amount,
        items: items || [],
        address: address || city
      });

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: true,
          orderId: orderId,
          chargeId: charge.id,
          message: 'Paiement réussi et commande enregistrée'
        })
      };
    }

    // ===== CAS 2: ABONNEMENT RÉCURRENT =====
    if (orderType === 'subscription') {
      const frequencyMap = {
        weekly: { interval: 'week', interval_count: 1 },
        biweekly: { interval: 'week', interval_count: 2 },
        monthly: { interval: 'month', interval_count: 1 }
      };

      const frequency = data.frequency || 'weekly';
      const freqConfig = frequencyMap[frequency] || frequencyMap.weekly;

      // Créer ou récupérer customer Stripe
      const customers = await stripe.customers.list({ email: email, limit: 1 });
      let customerId;

      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        const customer = await stripe.customers.create({
          email: email,
          name: name,

// ===== MAIN HANDLER =====
exports.handler = async (event) => {
  if (!stripe) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Stripe non configuré' })
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Méthode non autorisée' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { token, amount, email, name, address, city, postal, phone, orderType, items } = data;

    if (!token || !amount || !email || !name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Données manquantes: token, amount, email, name requis' })
      };
    }

    // ===== CRÉER PAYMENT METHOD =====
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: { token: token }
    });

    // ===== CAS 1: COMMANDE SIMPLE =====
    if (orderType === 'cart') {
      const charge = await stripe.charges.create({
        amount: Math.round(amount),
        currency: 'eur',
        source: token,
        receipt_email: email,
        metadata: {
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          delivery_address: address || city || postal,
          order_type: 'cart'
        }
      });

      const orderId = 'ORD-' + Date.now();

      // Envoyer email de confirmation
      await sendConfirmationEmail(email, name, {
        orderId: orderId,
        amount: amount,
        items: items || [],
        address: address || city
      });

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: true,
          orderId: orderId,
          chargeId: charge.id,
          message: 'Paiement réussi et commande enregistrée'
        })
      };
    }

    // ===== CAS 2: ABONNEMENT RÉCURRENT =====
    if (orderType === 'subscription') {
      const frequencyMap = {
        weekly: { interval: 'week', interval_count: 1 },
        biweekly: { interval: 'week', interval_count: 2 },
        monthly: { interval: 'month', interval_count: 1 }
      };

      const frequency = data.frequency || 'weekly';
      const freqConfig = frequencyMap[frequency] || frequencyMap.weekly;

      // Créer ou récupérer customer Stripe
      const customers = await stripe.customers.list({ email: email, limit: 1 });
      let customerId;

      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        const customer = await stripe.customers.create({
          email: email,
          name: name,
          phone: phone,
          address: {
            line1: address || city || '',
            postal_code: postal || '',
            city: city || ''
          }
        });
        customerId = customer.id;
      }

      // Créer produit et plan si nécessaire
      const productName = `Panier ${data.planName || 'Hebdomadaire'}`;
      
      const products = await stripe.products.search({
        query: `name:"${productName}"`
      });

      let productId;
      if (products.data.length > 0) {
        productId = products.data[0].id;
      } else {
        const product = await stripe.products.create({
          name: productName,
          type: 'service',
          metadata: { plan_type: 'subscription' }
        });
        productId = product.id;
      }

      // Créer prix récurrent
      const price = await stripe.prices.create({
        product: productId,
        unit_amount: Math.round(amount),
        currency: 'eur',
        recurring: {
          interval: freqConfig.interval,
          interval_count: freqConfig.interval_count
        }
      });

      // Créer abonnement
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price: price.id,
          quantity: 1
        }],
        default_payment_method: paymentMethod.id,
        automatic_tax: { enabled: false }
      });

      const subscriptionId = subscription.id;

      // Envoyer email
      await sendConfirmationEmail(email, name, {
        orderId: subscriptionId,
        amount: amount,
        items: [{ name: productName }],
        address: address || city,
        frequency: frequency
      });

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: true,
          orderId: subscriptionId,
          subscriptionId: subscriptionId,
          message: 'Abonnement activé avec succès'
        })
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Type de commande non reconnu' })
    };

  } catch (error) {
    console.error('Erreur:', error);
    
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: error.message || 'Erreur lors du traitement',
        code: error.code
      })
    };
  }
};
