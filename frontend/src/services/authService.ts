const base = '/api/v1'

export interface LoginRequest {
  username: string
  password: string
}

// TODO: fill in once the backend contract is known
export type LoginResponse = Record<string, unknown>

export class AuthApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthApiError'
  }
}

// TODO: confirm endpoint path, request body, and response shape
export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  let response: Response
  try {
    response = await fetch(`${base}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new AuthApiError('Could not reach the authentication service.')
  }

  if (response.status === 502 || response.status === 503) {
    throw new AuthApiError('Could not reach the authentication service.')
  }

  if (!response.ok) {
    let detail = `Login failed (${response.status}).`
    try {
      const body = (await response.json()) as { detail?: unknown }
      if (typeof body.detail === 'string') detail = body.detail
    } catch {
      // keep the status fallback
    }
    throw new AuthApiError(detail)
  }

  return response.json() as Promise<LoginResponse>
}
