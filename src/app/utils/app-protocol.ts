import { constants, createReadStream } from 'node:fs'
import { access } from 'node:fs/promises'
import { resolve } from 'node:path'
import { app, type CustomScheme, type Privileges, protocol } from 'electron'
import mime from 'mime'
import { pagePathBase } from './constants'

export function createAppProtocolScheme(
  scheme: string,
  privileges?: Partial<Privileges>,
): CustomScheme {
  const pri = {
    allowServiceWorkers: true,
    bypassCSP: false,
    corsEnabled: true,
    secure: true,
    standard: true,
    stream: true,
    supportFetchAPI: true,
  } satisfies Privileges

  return {
    scheme,
    privileges: privileges ? Object.assign(pri, privileges) : pri,
  }
}

export async function defaultHandleRequest(request: GlobalRequest): Promise<GlobalResponse> {
  const url = new URL(request.url)
  let pathname = decodeURIComponent(url.pathname)
  if (pathname === '/') {
    // SPA Fallback
    pathname = '/index.html'
  }

  const realPath = resolve(pagePathBase, pathname)

  try {
    await access(realPath, constants.R_OK | constants.F_OK)
  }
  catch {
    pathname = '/index.html'
  }

  return new Response(createReadStream(realPath), {
    headers: {
      'content-type': mime.getExtension(realPath) ?? 'application/octet-stream',
    },
  })
}

/**
 * **Note**: This method can only be used before the `ready` event of the `app` module gets emitted and can be called only once.
 *
 * Register a custom protocol which can used for accessing `web dist` with spa fallback.
 *
 * @param appScheme  Custom Scheme, `"app"` -> `app://...`
 */
export async function registerAppProtocol(
  appScheme: string,
  appPrivileges?: Partial<Privileges>,
  handleRequest: (request: GlobalRequest) => Promise<GlobalResponse> = defaultHandleRequest,
  customSchemes: CustomScheme[] = [],
): Promise<void> {
  protocol.registerSchemesAsPrivileged([
    createAppProtocolScheme(appScheme, appPrivileges),
    ...customSchemes,
  ])

  await app.whenReady()

  protocol.handle(appScheme, handleRequest)
}
