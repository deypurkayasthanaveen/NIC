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

// TODO(backend): POST multipart/form-data to the new registration endpoint; the current /api/v1/init expects a JSON body with client_secret. Kong also needs a larger request body size limit and the API needs file validation, storage, and email and contact_number columns.
export async function registerClient(values: {
  name: string
  email: string
  contact: string
  redirect: string
  document: File
}): Promise<void> {
  const formData = new FormData()
  formData.append('client_name', values.name)
  formData.append('email', values.email)
  formData.append('contact_number', values.contact)
  formData.append('redirect_urls', values.redirect)
  formData.append('document', values.document)

  if (import.meta.env.DEV) {
    console.warn('registerClient is using a simulated success because the backend is not connected')
    await new Promise<void>((resolve) => window.setTimeout(resolve, 600))
    return
  }

  throw new ClientApiError('Registration is not available yet.')
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
