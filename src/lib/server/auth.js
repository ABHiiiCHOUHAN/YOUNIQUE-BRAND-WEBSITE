import crypto from 'node:crypto';
import { env } from '$env/dynamic/private';

export const COOKIE_NAME = 'admin_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 4; // 4 hours max server token lifetime

function getAdminPassword() {
	return env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || 'younique-admin-2026!';
}

function getSessionSecret() {
	return (
		env.ADMIN_SESSION_SECRET ||
		process.env.ADMIN_SESSION_SECRET ||
		'younique-studio-secure-auth-secret-key-32-bytes-min'
	);
}

/**
 * Constant-time comparison to prevent timing attacks
 */
export function verifyPassword(inputPassword) {
	if (typeof inputPassword !== 'string' || inputPassword.length === 0) {
		return false;
	}

	const expectedPassword = getAdminPassword();
	const inputHash = crypto.createHash('sha256').update(inputPassword).digest();
	const expectedHash = crypto.createHash('sha256').update(expectedPassword).digest();

	return crypto.timingSafeEqual(inputHash, expectedHash);
}

/**
 * Creates an HMAC-signed session token containing timestamp
 */
export function createSessionToken() {
	const secret = getSessionSecret();
	const payload = Buffer.from(
		JSON.stringify({
			v: 2,
			admin: true,
			iat: Date.now()
		})
	).toString('base64url');

	const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');

	return `${payload}.${signature}`;
}

/**
 * Cryptographically verifies the HMAC signature and timestamp of the session token
 */
export function verifySessionToken(token) {
	if (!token || typeof token !== 'string') {
		return false;
	}

	const parts = token.split('.');
	if (parts.length !== 2) {
		return false;
	}

	const [payloadB64, signature] = parts;
	const secret = getSessionSecret();

	try {
		const expectedSignature = crypto
			.createHmac('sha256', secret)
			.update(payloadB64)
			.digest('base64url');

		const sigBuf = Buffer.from(signature);
		const expectedBuf = Buffer.from(expectedSignature);

		if (sigBuf.length !== expectedBuf.length) {
			return false;
		}

		if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) {
			return false;
		}

		const data = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));
		if (data.v !== 2 || !data.admin || !data.iat) {
			return false;
		}

		// Check session expiry (7 days)
		const ageMs = Date.now() - data.iat;
		if (ageMs > SESSION_MAX_AGE_SECONDS * 1000) {
			return false;
		}

		return true;
	} catch {
		return false;
	}
}

/**
 * Attaches the secure session cookie
 */
export function setSessionCookie(cookies) {
	const token = createSessionToken();
	cookies.set(COOKIE_NAME, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production'
	});
}

/**
 * Clears the session cookie
 */
export function clearSessionCookie(cookies) {
	cookies.delete(COOKIE_NAME, {
		path: '/'
	});
}
