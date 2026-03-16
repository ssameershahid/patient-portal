// TODO: Wire up when Stripe credentials are available
// Install: npm install stripe @stripe/stripe-js

export async function createCheckoutSession(_params: {
  appointmentType: string
  pricePence: number
  patientEmail: string
}) {
  // TODO: Replace with real Stripe checkout session creation
  console.log('Stripe checkout session placeholder — payment skipped')
  return { success: true, sessionId: 'placeholder_session' }
}

export async function createSubscription(_params: {
  tier: string
  patientEmail: string
  customerId?: string
}) {
  // TODO: Replace with real Stripe subscription creation
  console.log('Stripe subscription placeholder — subscription skipped')
  return { success: true, subscriptionId: 'placeholder_subscription' }
}

export async function cancelSubscription(_subscriptionId: string) {
  // TODO: Replace with real Stripe subscription cancellation
  console.log('Stripe cancel subscription placeholder')
  return { success: true }
}
