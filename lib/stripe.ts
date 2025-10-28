import Stripe from 'stripe'

// Initialize Stripe with secret key
// This is used for server-side operations like creating payment intents
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover', // Use latest API version
})

// Stripe configuration for client-side
// This uses the publishable key and is safe for browser use
export const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY!

// Helper function to create a checkout session
// This is used when customers want to purchase products
export async function createCheckoutSession({
  lineItems,
  customerEmail,
  successUrl,
  cancelUrl,
  metadata = {},
}: {
  lineItems: Array<{
    price_data: {
      currency: string
      product_data: {
        name: string
        description?: string
        images?: string[]
      }
      unit_amount: number
    }
    quantity: number
  }>
  customerEmail?: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Accept credit/debit cards
      line_items: lineItems,
      mode: 'payment', // One-time payment (not subscription)
      customer_email: customerEmail, // Pre-fill email if provided
      success_url: successUrl, // Where to redirect after successful payment
      cancel_url: cancelUrl, // Where to redirect if payment is cancelled
      metadata: metadata, // Additional data to store with the session
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU'], // Restrict to specific countries
      },
      // Configure automatic tax calculation if you have Stripe Tax enabled
      // automatic_tax: { enabled: true },
    })

    return session
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw new Error('Failed to create checkout session')
  }
}

// Helper function to retrieve a checkout session
// Used to verify payment status after redirect
export async function getCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return session
  } catch (error) {
    console.error('Error retrieving checkout session:', error)
    throw new Error('Failed to retrieve checkout session')
  }
}

// Helper function to create a payment intent
// Alternative to checkout sessions for more control
export async function createPaymentIntent({
  amount,
  currency = 'usd',
  metadata = {},
}: {
  amount: number
  currency?: string
  metadata?: Record<string, string>
}) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: currency,
      metadata: metadata,
      // Enable automatic payment methods
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return paymentIntent
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw new Error('Failed to create payment intent')
  }
}

// Helper function to construct webhook event
// Used to verify webhook signatures for security
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  secret: string
) {
  try {
    return stripe.webhooks.constructEvent(payload, signature, secret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    throw new Error('Invalid webhook signature')
  }
}

// Helper function to format price for display
// Converts cents to dollars with proper formatting
export function formatPrice(amountInCents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amountInCents / 100)
}

// Helper function to convert dollars to cents
// Stripe requires amounts in cents
export function convertToCents(dollars: number): number {
  return Math.round(dollars * 100)
}
