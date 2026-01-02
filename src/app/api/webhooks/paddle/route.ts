import { NextRequest, NextResponse } from 'next/server';
import { handleWebhookEvent } from '@/lib/paddle-api';

/**
 * POST /api/webhooks/paddle
 * Handle Paddle webhook events
 */
export async function POST(request: NextRequest) {
  try {
    // Get webhook signature from headers
    const signature = request.headers.get('paddle-signature');
    
    if (!signature) {
      console.error('Missing paddle-signature header');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }
    
    // Get raw body for signature verification
    const rawBody = await request.text();
    
    // TODO: Verify webhook signature using Paddle's public key
    // For now, we'll skip verification in sandbox mode
    // In production, you should verify the signature
    
    // Parse webhook data
    const eventData = JSON.parse(rawBody);
    
    console.log('Received Paddle webhook:', eventData.event_type);
    
    // Handle the event
    await handleWebhookEvent(eventData);
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { error: 'Failed to handle webhook' },
      { status: 500 }
    );
  }
}