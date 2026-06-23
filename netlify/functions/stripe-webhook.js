const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
const stripe = stripeSecretKey ? require('stripe')(stripeSecretKey) : null;

exports.handler = async (event) => {
  if (!stripe) {
    console.error('Stripe not configured (webhook).');
    return { statusCode: 500, body: 'Stripe not configured' };
  }

  const sig = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
  let payload = event.body;

  try {
    let stripeEvent;
    if (webhookSecret && sig) {
      stripeEvent = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
      console.log('Webhook signature verified. type=', stripeEvent.type);
    } else {
      // If no webhook secret provided, attempt to parse body (best-effort)
      stripeEvent = JSON.parse(payload);
      console.warn('No webhook secret configured — skipping signature verification.');
    }

    // Handle the event
    switch (stripeEvent.type) {
      case 'payment_intent.succeeded':
        console.log('payment_intent.succeeded for', stripeEvent.data.object.id);
        // Option: trigger post-payment processing here (emails, DB update)
        break;
      case 'payment_intent.payment_failed':
        console.log('payment_intent.payment_failed for', stripeEvent.data.object.id);
        break;
      default:
        console.log('Unhandled event type', stripeEvent.type);
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (err) {
    console.error('Webhook handling error:', err && err.message ? err.message : err);
    return { statusCode: 400, body: `Webhook error: ${err && err.message ? err.message : 'invalid payload'}` };
  }
};
