import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unexpected UI error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-zinc-950 px-6 text-zinc-50">
          <div className="text-center">
            <h1 className="!text-2xl font-semibold">Unexpected error</h1>
            <p className="mt-2 text-zinc-400">Reload the page to continue.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-md bg-zinc-50 px-5 py-2.5 font-medium !text-zinc-900"
            >
              Reload
            </button>
          </div>
        </main>
      )
    }
    return this.props.children
  }
}
