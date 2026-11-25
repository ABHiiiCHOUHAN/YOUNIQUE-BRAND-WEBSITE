import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

/** @type {Map<string, Promise<unknown>>} */
const fileLocks = new Map();

/**
 * Acquire an exclusive per-file async mutex lock so concurrent read-modify-write
 * operations on the same JSON file execute strictly sequentially without race conditions.
 *
 * @template T
 * @param {string} filePath
 * @param {() => Promise<T>} fn
 * @returns {Promise<T>}
 */
function withFileLock(filePath, fn) {
	const resolved = path.resolve(filePath);
	const prev = fileLocks.get(resolved) || Promise.resolve();
	const next = prev.then(fn, fn);

	const cleanup = next.then(
		() => {
			if (fileLocks.get(resolved) === cleanup) {
				fileLocks.delete(resolved);
			}
		},
		() => {
			if (fileLocks.get(resolved) === cleanup) {
				fileLocks.delete(resolved);
			}
		}
	);
	fileLocks.set(resolved, cleanup);
	return next;
}

/**
 * Atomically write JSON data via a unique temporary file + POSIX rename
 * so readers never see partial or corrupted JSON.
 *
 * @param {string} filePath
 * @param {unknown} data
 */
async function writeJsonAtomic(filePath, data) {
	const dir = path.dirname(filePath);
	await fs.mkdir(dir, { recursive: true });
	const tmpPath = path.join(
		dir,
		`.${path.basename(filePath)}.${process.pid}.${crypto.randomUUID()}.tmp`
	);
	const serialized = JSON.stringify(data, null, 2);
	await fs.writeFile(tmpPath, serialized, 'utf-8');
	await fs.rename(tmpPath, filePath);
}

/**
 * Safely read and parse a JSON file, initializing with `defaultValue` if missing.
 *
 * @template T
 * @param {string} filePath
 * @param {T | (() => T)} defaultValue
 * @returns {Promise<T>}
 */
export async function readJson(filePath, defaultValue) {
	try {
		const content = await fs.readFile(filePath, 'utf-8');
		return JSON.parse(content);
	} catch (err) {
		if (err?.code === 'ENOENT') {
			const fallback = typeof defaultValue === 'function' ? defaultValue() : defaultValue;
			await withFileLock(filePath, async () => {
				try {
					await fs.access(filePath);
				} catch {
					await writeJsonAtomic(filePath, fallback);
				}
			});
			return fallback;
		}
		throw err;
	}
}

/**
 * Perform a serialized, atomic read-modify-write update on a JSON file.
 * Concurrent calls for the same file are queued and executed one at a time.
 *
 * @template T
 * @template R
 * @param {string} filePath
 * @param {T | (() => T)} defaultValue
 * @param {(current: T) => Promise<{ data?: T, result: R }> | { data?: T, result: R }} updater
 * @returns {Promise<R>}
 */
export function updateJson(filePath, defaultValue, updater) {
	return withFileLock(filePath, async () => {
		let current;
		try {
			const content = await fs.readFile(filePath, 'utf-8');
			current = JSON.parse(content);
		} catch (err) {
			if (err?.code === 'ENOENT') {
				current = typeof defaultValue === 'function' ? defaultValue() : structuredClone(defaultValue);
			} else {
				throw err;
			}
		}

		const { data: nextData, result } = await updater(current);
		if (nextData !== undefined) {
			await writeJsonAtomic(filePath, nextData);
		}
		return result;
	});
}
