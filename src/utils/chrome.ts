export async function getCurrentTab(): Promise<chrome.tabs.Tab | undefined> {
  try {
    let queryOptions = { active: true, lastFocusedWindow: true }
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions)
    return tab
  } catch (err) {
    // NOTE: Chrome should not throw an error.
    // console.error(err)
    return undefined
  }
}
