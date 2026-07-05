/**
 * Stripe redirect URLs and mobile deep-link helpers.
 */

const normalizeUrl = (url) => String(url || '').replace(/\/$/, '');

export function isMobileClient(req) {
  return req?.clientPlatform === 'mobile' || req?.body?.platform === 'mobile';
}

export function getCapacitorAppOrigin() {
  return normalizeUrl(process.env.MOBILE_CAPACITOR_ORIGIN || 'https://localhost');
}

export function getMobileStripeBridgeBase() {
  return normalizeUrl(
    process.env.BACKEND_URL ||
      process.env.API_PUBLIC_URL ||
      `http://localhost:${process.env.PORT || 5000}`
  );
}

export function getStripeCheckoutReturnBase(req) {
  if (isMobileClient(req)) {
    return getMobileStripeBridgeBase();
  }
  return normalizeUrl(process.env.FRONTEND_URL || process.env.LOCAL_FRONTEND_URL || 'http://localhost:3000');
}

export function buildStripeCheckoutRedirectUrl(
  req,
  { returnPath = '/dashboard', flow = 'refill', status = 'success' } = {}
) {
  const destPath =
    typeof returnPath === 'string' && returnPath.startsWith('/') && !returnPath.startsWith('//')
      ? returnPath
      : '/dashboard';

  const base = getStripeCheckoutReturnBase(req);
  const flowKey = flow === 'upgrade' ? 'upgrade' : 'refill';
  const queryParts =
    status === 'success'
      ? [`${flowKey}=success`, 'session_id={CHECKOUT_SESSION_ID}']
      : [`${flowKey}=cancelled`];

  if (isMobileClient(req)) {
    queryParts.push(`to=${encodeURIComponent(destPath)}`);
    return `${normalizeUrl(base)}/api/mobile/stripe/app-return?${queryParts.join('&')}`;
  }

  const joiner = destPath.includes('?') ? '&' : '?';
  return `${normalizeUrl(base)}${destPath}${joiner}${queryParts.join('&')}`;
}
