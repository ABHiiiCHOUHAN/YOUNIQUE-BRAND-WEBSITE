import sanitizeHtml from 'sanitize-html';

const ALLOWED_TAGS = [
	'b',
	'i',
	'em',
	'strong',
	'u',
	's',
	'p',
	'br',
	'hr',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'ul',
	'ol',
	'li',
	'blockquote',
	'code',
	'pre',
	'a',
	'span'
];

const ALLOWED_ATTRIBUTES = {
	a: ['href', 'target', 'rel']
};

/**
 * Sanitize HTML content for blog posts to prevent Stored XSS.
 * Strips scripts, event handlers, dangerous tags, and unsafe URL schemes.
 */
export function sanitizeBlogHtml(dirty) {
	if (!dirty || typeof dirty !== 'string') return '';
	return sanitizeHtml(dirty, {
		allowedTags: ALLOWED_TAGS,
		allowedAttributes: ALLOWED_ATTRIBUTES,
		allowedSchemes: ['http', 'https', 'mailto'],
		transformTags: {
			a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }, true)
		}
	});
}

/**
 * Strip all HTML tags from plain text inputs (reviews, names, roles).
 */
export function sanitizePlainText(dirty) {
	if (!dirty || typeof dirty !== 'string') return '';
	return sanitizeHtml(dirty, {
		allowedTags: [],
		allowedAttributes: {}
	}).trim();
}
