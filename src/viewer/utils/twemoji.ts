import twemoji from '@twemoji/api'

/**
 * 拡張機能内の SVG アセットへのベース URL を取得
 */
function getTwemojiBaseUrl(): string {
  return browser.runtime.getURL('twemoji/')
}

/**
 * テキスト内の絵文字を twemoji の img タグに変換する
 * @param text - 変換対象のテキスト（HTML を含む可能性あり）
 * @returns 絵文字が img タグに置換された HTML 文字列
 */
export function parseEmoji(text: string): string {
  const base = getTwemojiBaseUrl()
  return twemoji.parse(text, {
    className: 'emoji twemoji',
    callback: (icon: string) => `${base}${icon}.svg`
  })
}

/**
 * HTML エスケープしてから twemoji パースする
 * XSS 対策が必要なユーザー入力に使用
 * @param text - エスケープ対象のテキスト
 * @returns HTML エスケープ + twemoji パース済みの文字列
 */
export function escapeAndParseEmoji(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
  return parseEmoji(escaped)
}
