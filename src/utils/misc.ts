import crypto from 'crypto'
import { v4 as uuidV4 } from 'uuid'

export function parseValidSnapshotProposalUrl(url: string): string | undefined {
  // Valid match URLs like `https://snapshot.org/#/aave.eth/proposal/0x34a735f4cbb0c91febe9e26a974811737b656fde16c82310073a821d3a654304`,
  // where (ignore case):
  // 1. `aave.eth` or `uniswap` is the space name
  // 2. `0x34a735f4cbb0c91febe9e26a974811737b656fde16c82310073a821d3a654304` is the proposal ID, a 64-character hex string (EVM address)
  const regex = new RegExp(
    /https:\/\/snapshot\.org\/#\/.+\/proposal\/0x[a-f0-9]{40}/i,
  )
  return regex.test(url) ? url.split('/').slice(-1)[0] : undefined
}

export function truncateIfAddressOrLong(str: string, maxLen: number = 20): string {
  const isAddress = /0x[a-f0-9]{40}/i.test(str) // no checksum check
  return isAddress ? `${str.slice(0, 8)}...${str.slice(-6)}` : str.slice(0, 20)
}

/**
 * Returns timestamp as a string in the format `yyyy-MM-dd`.
 * @param timestamp
 * @returns
 */
export function timestampToDateString(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10)
}

/**
 * Returns timestamp as a string in the format `yyyy-MM-dd HH:mm`.
 * @param timestamp
 * @returns
 */
export function timestampToDateHourString(timestamp: number): string {
  const pd = (nr: number) => `${nr}`.padStart(2, '0') // pad to double digit (with 0)
  const front = timestampToDateString(timestamp)
  const dt = new Date(timestamp)
  return `${front} ${pd(dt.getHours())}:${pd(dt.getMinutes())}`
}

export function numToCompactString(num: number): string {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num)
}

export function parseQuorumReadable(
  quorum: number,
  votes: number,
): [string, string] {
  if (votes >= quorum) return ['Exceeded', '']
  const currPerc = (votes / quorum) * 100
  return [
    `Need ${numToCompactString(quorum - votes)} more`,
    `${currPerc.toFixed(2)}%`,
  ]
}

// Binary-search-like to find the nearest index of value in sorted array
export function findNearestIndexOfValue(arr: number[], target: number): number {
  let left = 0
  let right = arr.length - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)

    if (arr[mid] === target) return mid
    else if (arr[mid] < target) left = mid + 1
    else right = mid - 1
  }

  // With two adjacent values for the target, return the element that is the nearest to the target
  return Math.abs(arr[left] - target) < Math.abs(arr[right] - target)
    ? left
    : right
}

/**
 * Generate Content Security Policy for the app.
 * Uses randomly generated nonce (base64)
 *
 * @returns [csp: string, nonce: string] - CSP string in first array element, nonce in the second array element.
 */
export function generateCsp(): [csp: string, nonce: string] {
  const production = process.env.NODE_ENV === 'production'

  // generate random nonce converted to base64. Must be different on every HTTP page load
  const hash = crypto.createHash('sha256')
  hash.update(uuidV4())
  const nonce = hash.digest('base64')

  let csp = ``
  csp += `default-src 'none';`
  csp += `base-uri 'self';`
  csp += `style-src https://fonts.googleapis.com 'unsafe-inline';` // NextJS requires 'unsafe-inline'
  csp += `script-src 'nonce-${nonce}' 'self' ${
    production ? '' : "'unsafe-eval'"
  };` // NextJS requires 'self' and 'unsafe-eval' in dev (faster source maps)
  csp += `font-src https://fonts.gstatic.com;`
  csp += `connect-src 'self' https://hub.snapshot.org/graphql;` // need for accessing snapshot API

  return [csp, nonce]
}

// https://github.com/vercel/next.js/blob/canary/examples/with-strict-csp/pages/_document.js#L4C1-L8C2
export const cspHashOf = (text: string) => {
  const hash = crypto.createHash('sha256')
  hash.update(text)
  return `'sha256-${hash.digest('base64')}'`
}
