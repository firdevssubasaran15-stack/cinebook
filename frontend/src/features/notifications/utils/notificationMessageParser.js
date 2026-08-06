/**
 * Notification Message Parser Utility
 * 
 * Handles two message formats:
 * 1. NEW (JSON): { key, ...params }  — created after i18n migration
 * 2. LEGACY (plain Turkish strings) — created before i18n migration
 *
 * Pattern: Strategy Pattern for message parsing
 */

/**
 * Legacy Turkish message patterns mapped to i18n descriptor factories.
 * Each entry: { regex, toDescriptor(match) -> { key, ...params } }
 */
const LEGACY_PATTERNS = [
  {
    // "@hllbr yorumunu beğendi. (Toplam beğeni: 2)"
    regex: /^(@\S+) yorumunu be[gğ]endi\. \(Toplam be[gğ]eni: (\d+)\)$/u,
    toDescriptor: (match) => ({
      key: 'notifications.comment_liked',
      username: match[1],
      count: match[2],
    }),
  },
  {
    // "@hllbr yorumunuza cevap verdi."
    regex: /^(@\S+) yorumunuza cevap verdi\.$/u,
    toDescriptor: (match) => ({
      key: 'notifications.reply',
      username: match[1],
    }),
  },
  {
    // "@hllbr seni takip etmeye başladı."
    regex: /^(@\S+) seni takip etmeye ba[şs]lad[ıi]\.$/u,
    toDescriptor: (match) => ({
      key: 'notifications.follow',
      username: match[1],
    }),
  },
];

/**
 * Attempts to parse a notification message into an i18n descriptor.
 * Tries JSON parse first, then falls back to legacy Turkish pattern matching.
 *
 * @param {string} message - Raw message string from the backend
 * @returns {{ key: string, [param: string]: any } | null}
 *   Returns a descriptor if parseable, null if it should be rendered as-is.
 */
export function parseToDescriptor(message) {
  if (!message) return null;

  // 1. Try JSON structured format (new messages)
  try {
    const parsed = JSON.parse(message);
    if (parsed?.key) return parsed;
  } catch {
    // Not JSON, continue
  }

  // 2. Try legacy Turkish pattern matching
  for (const { regex, toDescriptor } of LEGACY_PATTERNS) {
    const match = message.match(regex);
    if (match) return toDescriptor(match);
  }

  return null;
}

/**
 * Resolves a notification message string into a translated display string.
 *
 * @param {string} message - Raw message from DB
 * @param {Function} t - i18next translation function
 * @returns {string}
 */
export function resolveNotificationMessage(message, t) {
  const descriptor = parseToDescriptor(message);
  if (descriptor) {
    return t(descriptor.key, descriptor);
  }
  // Absolute fallback: return plain text as stored
  return message ?? '';
}
