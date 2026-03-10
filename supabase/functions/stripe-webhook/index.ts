import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2025-08-27.basil",
  });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    let event: Stripe.Event;
    
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      event = JSON.parse(body);
      logStep("WARNING: No webhook secret configured, parsing body directly");
    }

    logStep("Event received", { type: event.type, id: event.id });

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        if (!userId) { logStep("No user_id in metadata"); break; }

        if (session.mode === "subscription") {
          logStep("Subscription checkout completed", { userId });
          // Subscription will be synced by check-subscription
        } else if (session.mode === "payment") {
          const guideId = session.metadata?.guide_id;
          const guideName = session.metadata?.guide_name;
          logStep("Guide purchase completed", { userId, guideId });

          if (guideId) {
            await supabase.from('purchases').insert({
              user_id: userId,
              stripe_checkout_session_id: session.id,
              stripe_payment_intent_id: session.payment_intent as string,
              guide_id: guideId,
              guide_name: guideName,
              amount_paid: session.amount_total || 0,
              currency: session.currency || 'brl',
              status: 'completed',
            });
          }
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerEmail = (await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer).email;
        
        if (!customerEmail) { logStep("No customer email"); break; }

        // Find user by email
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', customerEmail)
          .limit(1);

        if (!profiles || profiles.length === 0) { logStep("No profile found for email"); break; }
        const userId = profiles[0].id;

        const isActive = subscription.status === "active" || subscription.status === "trialing";
        const priceId = subscription.items.data[0]?.price.id;
        
        let planType = 'monthly';
        if (priceId === "price_1T9XZ6J2w2OK6FGMPG0Yx3t8") planType = "weekly";
        else if (priceId === "price_1T9YqIJ2w2OK6FGMSod2kUak") planType = "yearly";

        // Update subscriptions table
        await supabase.from('subscriptions').upsert({
          user_id: userId,
          stripe_subscription_id: subscription.id,
          stripe_price_id: priceId,
          plan_type: planType,
          status: subscription.status === "active" ? "active" : subscription.status === "canceled" ? "canceled" : "inactive",
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'stripe_subscription_id' });

        // Update access_levels
        await supabase.from('access_levels').upsert({
          user_id: userId,
          level: isActive ? 'premium' : 'free',
          source: isActive ? 'subscription' : 'none',
          granted_at: isActive ? new Date().toISOString() : null,
          expires_at: isActive ? new Date(subscription.current_period_end * 1000).toISOString() : null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

        logStep(`Subscription ${event.type}`, { userId, status: subscription.status, isActive });
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: msg });
    return new Response(JSON.stringify({ error: msg }), { status: 400 });
  }
});
