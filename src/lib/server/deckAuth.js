import crypto from 'node:crypto';
import { env } from '$env/dynamic/private';

const DECK_SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getDeckSecret() {
	return (
		env.ADMIN_SESSION_SECRET ||
		process.env.ADMIN_SESSION_SECRET ||
		'younique-studio-secure-auth-secret-key-32-bytes-min'
	);
}

export function deckCookieName(slug) {
	const safe = String(slug || '')
		.toLowerCase()
		.replace(/[^a-z0-9_-]/g, '');
	return `deck_session_${safe}`;
}

export function deckLockCookieName(slug) {
	const safe = String(slug || '')
		.toLowerCase()
		.replace(/[^a-z0-9_-]/g, '');
	return `deck_locked_${safe}`;
}

/**
 * Generates a salted scrypt hash of a client deck passcode.
 * Format: "<hexSalt>:<hexDerivedKey>"
 */
export function hashDeckPasscode(passcode) {
	const salt = crypto.randomBytes(16).toString('hex');
	const derived = crypto.scryptSync(String(passcode), salt, 64).toString('hex');
	return `${salt}:${derived}`;
}

/**
 * Constant-time verification of a submitted passcode against a stored scrypt hash.
 */
export function verifyDeckPasscode(inputPasscode, storedHash) {
	if (
		typeof inputPasscode !== 'string' ||
		!inputPasscode ||
		typeof storedHash !== 'string' ||
		!storedHash.includes(':')
	) {
		return false;
	}

	const [salt, keyHex] = storedHash.split(':');
	if (!salt || !keyHex) return false;

	try {
		const derived = crypto.scryptSync(inputPasscode, salt, 64);
		const expected = Buffer.from(keyHex, 'hex');
		if (derived.length !== expected.length) return false;
		return crypto.timingSafeEqual(derived, expected);
	} catch {
		return false;
	}
}

export function createDeckToken(slug) {
	const payload = Buffer.from(
		JSON.stringify({
			deck: slug,
			iat: Date.now()
		})
	).toString('base64url');

	const signature = crypto
		.createHmac('sha256', getDeckSecret())
		.update(payload)
		.digest('base64url');

	return `${payload}.${signature}`;
}

export function verifyDeckToken(slug, token) {
	if (!token || typeof token !== 'string') return false;
	const parts = token.split('.');
	if (parts.length !== 2) return false;

	const [payloadB64, signature] = parts;
	try {
		const expectedSig = crypto
			.createHmac('sha256', getDeckSecret())
			.update(payloadB64)
			.digest('base64url');

		const sigBuf = Buffer.from(signature);
		const expBuf = Buffer.from(expectedSig);
		if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
			return false;
		}

		const data = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));
		if (data.deck !== slug || !data.iat) return false;

		if (Date.now() - data.iat > DECK_SESSION_MAX_AGE * 1000) return false;
		return true;
	} catch {
		return false;
	}
}

export function setDeckCookie(cookies, slug) {
	const token = createDeckToken(slug);
	cookies.delete(deckLockCookieName(slug), { path: '/' });
	cookies.set(deckCookieName(slug), token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: DECK_SESSION_MAX_AGE
	});
}

export function clearDeckCookie(cookies, slug) {
	cookies.delete(deckCookieName(slug), { path: '/' });
	cookies.delete(deckCookieName(slug), { path: `/deck/${slug}` });
	cookies.set(deckLockCookieName(slug), '1', {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: DECK_SESSION_MAX_AGE
	});
}
