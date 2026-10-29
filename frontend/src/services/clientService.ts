export interface InitRequest {
  client_name: string
  client_secret: string
  redirect_urls: string
}

export interface InitResponse {
  transaction_id: string
  client_id: string
  client_secret: string
  status: string
}

export interface ClientDetails {
  client_name: string
  redirect_urls: string
}

export interface ClientListItem {
  client_id: string
  client_name: string
  redirect_urls: string
  date: string
}

export class ClientApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ClientApiError'
  }
}

export async function initClient(data: InitRequest): Promise<InitResponse> {
  let response: Response
  try {
    response = await fetch('/api/v1/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  } catch {
    throw new ClientApiError('Could not reach the registration service.')
  }

  if (response.status === 502 || response.status === 503) {
    throw new ClientApiError('Could not reach the registration service.')
  }

  if (!response.ok) {
    let detail = `Registration failed (${response.status}).`
    try {
      const body = (await response.json()) as { detail?: unknown }
      if (typeof body.detail === 'string') detail = body.detail
    } catch {
      // keep the status fallback
    }
    throw new ClientApiError(detail)
  }

  return response.json() as Promise<InitResponse>
}

export async function getClientById(clientId: string): Promise<ClientDetails> {
  let response: Response
  try {
    response = await fetch(`/api/v1/clients/${encodeURIComponent(clientId)}`)
  } catch {
    throw new ClientApiError('Could not reach the registration service.')
  }

  if (response.status === 502 || response.status === 503) {
    throw new ClientApiError('Could not reach the registration service.')
  }

  if (response.status === 404) {
    throw new ClientApiError('Client not found.')
  }

  if (!response.ok) {
    let detail = `Lookup failed (${response.status}).`
    try {
      const body = (await response.json()) as { detail?: unknown }
      if (typeof body.detail === 'string') detail = body.detail
    } catch {
      // keep the status fallback
    }
    throw new ClientApiError(detail)
  }

  return response.json() as Promise<ClientDetails>
}

export async function listClients(): Promise<ClientListItem[]> {
  let response: Response
  try {
    response = await fetch('/api/v1/clients')
  } catch {
    throw new ClientApiError('Could not reach the registration service.')
  }

  if (response.status === 502 || response.status === 503) {
    throw new ClientApiError('Could not reach the registration service.')
  }

  if (!response.ok) {
    let detail = `Failed to load clients (${response.status}).`
    try {
      const body = (await response.json()) as { detail?: unknown }
      if (typeof body.detail === 'string') detail = body.detail
    } catch {
      // keep the status fallback
    }
    throw new ClientApiError(detail)
  }

  return response.json() as Promise<ClientListItem[]>
}
