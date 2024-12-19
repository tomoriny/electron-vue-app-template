import { session } from 'electron'

export function useCspHeaders(csp?: string[], devBypass = true) {
  if (import.meta.env.DEV && devBypass)
    return

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'content-security-policy': csp ?? [`default-src 'none'`],
      },
    })
  })
}
