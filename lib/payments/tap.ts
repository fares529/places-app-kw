/**
 * Tap Payments integration.
 *
 * In production: set TAP_SECRET_KEY (sk_test_... or sk_live_...) in env.
 * Without the key, the system runs in DEMO MODE (simulated payments).
 *
 * Docs: https://developers.tap.company/docs/charges
 */

const TAP_API = 'https://api.tap.company/v2';

export function isTapConfigured(): boolean {
  return Boolean(process.env.TAP_SECRET_KEY);
}

export interface CreateChargeParams {
  amount: number;
  currency: string;
  description: string;
  customer: { name: string; phone: string; countryCode: string };
  redirectUrl: string;
  webhookUrl?: string;
  metadata?: Record<string, string>;
}

export interface ChargeResult {
  id: string;
  status: string;          // INITIATED, PENDING, AUTHORIZED, CAPTURED, FAILED, ...
  paymentUrl: string | null;
  raw?: unknown;
}

/**
 * Create a Tap charge. Returns paymentUrl to redirect the user to.
 * In demo mode (no TAP_SECRET_KEY), returns a fake URL that auto-confirms.
 */
export async function createCharge(params: CreateChargeParams): Promise<ChargeResult> {
  if (!isTapConfigured()) {
    // Demo mode — return a fake charge that the demo callback handles.
    const fakeId = `chg_demo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const url = new URL(params.redirectUrl);
    url.searchParams.set('tap_id', fakeId);
    url.searchParams.set('demo', '1');
    return {
      id: fakeId,
      status: 'INITIATED',
      paymentUrl: url.toString(),
    };
  }

  const res = await fetch(`${TAP_API}/charges`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: params.amount,
      currency: params.currency,
      threeDSecure: true,
      save_card: false,
      description: params.description,
      statement_descriptor: 'KuwaitGuide',
      reference: { transaction: `kpg_${Date.now()}`, order: `kpg_${Date.now()}` },
      customer: {
        first_name: params.customer.name || 'Guest',
        phone: { country_code: params.customer.countryCode, number: params.customer.phone },
      },
      source: { id: 'src_all' },
      redirect: { url: params.redirectUrl },
      ...(params.webhookUrl ? { post: { url: params.webhookUrl } } : {}),
      metadata: params.metadata || {},
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Tap charge failed: ${res.status} ${txt}`);
  }
  const data = await res.json();
  return {
    id: data.id,
    status: data.status,
    paymentUrl: data?.transaction?.url || null,
    raw: data,
  };
}

/**
 * Retrieve a charge from Tap.
 * In demo mode, returns a fake CAPTURED status (auto-success).
 */
export async function retrieveCharge(chargeId: string): Promise<ChargeResult> {
  if (!isTapConfigured() || chargeId.startsWith('chg_demo_')) {
    return {
      id: chargeId,
      status: 'CAPTURED',
      paymentUrl: null,
    };
  }

  const res = await fetch(`${TAP_API}/charges/${chargeId}`, {
    headers: { Authorization: `Bearer ${process.env.TAP_SECRET_KEY}` },
  });
  if (!res.ok) throw new Error(`Tap retrieve failed: ${res.status}`);
  const data = await res.json();
  return {
    id: data.id,
    status: data.status,
    paymentUrl: data?.transaction?.url || null,
    raw: data,
  };
}
