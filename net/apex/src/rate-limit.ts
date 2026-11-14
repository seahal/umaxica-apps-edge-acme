import { errorPage } from './status-page';
import { requestThemeAttribute } from './theme';

export interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

/**
 * The 429 document.
 *
 * It is the same `statusPage` the 404 and the error boundary answer with, so a
 * rate-limited visitor gets a titled, styled, `no-store` page rather than the
 * bare `Too Many Requests` string this used to return. A 429 is a full document
 * an attacker can elicit on demand; it must not be the one page on this origin
 * served without a title, a `Content-Type` or a caching directive.
 *
 * Returned bare of security headers on purpose: `apexSecurityHeaders` runs
 * ahead of the limiter middleware in `create-apex-app.ts`, so this response
 * unwinds back through it and is decorated in the same place every other
 * response is.
 */
/*
 * `language` is whatever the unit's one language detector resolved for this
 * request (`create-apex-app.ts`), handed in rather than re-derived here: rate
 * limiting has no locale precedence of its own. `errorPage` is the same document
 * every other refused request on this origin gets, so the 429 shares its wording
 * — and its fallback to English when nothing was detected, which is the case on
 * the machine endpoints that are deliberately never language-negotiated.
 */
export function rateLimitedResponse(request: Request, language?: string): Response {
  return errorPage(429, language, requestThemeAttribute(request));
}

/*
 * Missing client identity uses one bounded fallback bucket. A pathname is
 * attacker-controlled: using it as a key lets a caller obtain a fresh budget
 * for every random URL, including URLs that only produce a 404.
 * Unattributable callers deliberately share a conservative limit.
 */
function rateLimitKey(request: Request): string {
  const ip = request.headers.get('cf-connecting-ip');
  if (ip !== null && ip !== '') {
    return ip;
  }

  return 'no-ip';
}

/**
 * Returns the 429 document when the limiter refuses, and `null` when the
 * request may proceed — including when no limiter is bound at all, which is the
 * case under `vite dev`.
 */
export async function checkRateLimit(
  request: Request,
  rateLimiter: RateLimiter | undefined,
  language?: string,
): Promise<Response | null> {
  if (!rateLimiter) return null;

  const { success } = await rateLimiter.limit({ key: rateLimitKey(request) });
  return success ? null : rateLimitedResponse(request, language);
}
