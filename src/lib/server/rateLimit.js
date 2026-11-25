const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 4; // Max 4 submissions per IP per 10 minutes
const MAX_TRACKED_IPS = 5000;

/** @type {Map<string, number[]>} */
const ipRequests = new Map();

/**
 * Sliding-window in-memory rate limiter by IP address.
 * Bounded to MAX_TRACKED_IPS to prevent memory exhaustion under DDoS.
 *
 * @param {string} ip
 * @returns {{ allowed: boolean, retryAfterSeconds: number }}
 */
export function checkRateLimit(ip) {
	const now = Date.now();
	const windowStart = now - WINDOW_MS;

	// Prune oldest entries if map grows too large
	if (ipRequests.size >= MAX_TRACKED_IPS && !ipRequests.has(ip)) {
		for (const [key, timestamps] of ipRequests) {
			const active = timestamps.filter((t) => t > windowStart);
			if (active.length === 0) {
				ipRequests.delete(key);
			}
			if (ipRequests.size < MAX_TRACKED_IPS * 0.8) break;
		}
		// If still full, evict oldest inserted key
		if (ipRequests.size >= MAX_TRACKED_IPS) {
			const firstKey = ipRequests.keys().next().value;
			if (firstKey !== undefined) ipRequests.delete(firstKey);
		}
	}

	const existing = ipRequests.get(ip) || [];
	const recent = existing.filter((timestamp) => timestamp > windowStart);

	if (recent.length >= MAX_REQUESTS) {
		const oldestRelevant = recent[0];
		const retryAfterMs = oldestRelevant + WINDOW_MS - now;
		return {
			allowed: false,
			retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000))
		};
	}

	recent.push(now);
	ipRequests.set(ip, recent);

	return { allowed: true, retryAfterSeconds: 0 };
}
