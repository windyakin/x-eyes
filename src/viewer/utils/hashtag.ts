/**
 * ハッシュタグ検出ユーティリティ
 *
 * Xのハッシュタグ仕様に基づき、マルチバイト文字（日本語等）を含む
 * ハッシュタグを正しく検出する
 */

/**
 * ハッシュタグに使用できる文字のパターン（許可文字方式）
 * - \p{L}: Unicode Letter（全言語の文字、長音記号「ー」含む）
 * - \p{M}: Unicode Mark（結合文字、濁点など）
 * - \p{Nd}: Unicode Decimal Number（数字）
 * - _: アンダースコア
 */
const HASHTAG_CHAR_PATTERN = '[\\p{L}\\p{M}\\p{Nd}_]'

/**
 * ハッシュタグ検出用正規表現
 * #または＃で始まり、許可文字が1文字以上続く
 */
const HASHTAG_REGEX = new RegExp(
  `[#＃](${HASHTAG_CHAR_PATTERN}+)`,
  'gu'
)

/**
 * 数字のみで構成されているかチェック
 * 数字のみのハッシュタグはXでは無効
 */
function isNumericOnly(text: string): boolean {
  return /^\d+$/.test(text)
}

/**
 * テキスト内のハッシュタグをスタイル付きspanに変換する
 * @param text - 変換対象のテキスト
 * @returns ハッシュタグがspan要素に置換されたテキスト
 */
export function formatHashtags(text: string): string {
  return text.replace(HASHTAG_REGEX, (match, tag) => {
    // 数字のみのハッシュタグは変換しない
    if (isNumericOnly(tag)) {
      return match
    }
    return `<span class="hashtag">${match}</span>`
  })
}
