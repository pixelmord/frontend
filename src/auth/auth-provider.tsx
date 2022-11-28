import type { Session } from '@ory/client'
import type { AuthorizationPayload } from '@serlo/authorization'
import { createContext, ReactNode, useEffect, useState } from 'react'

import { getAuthPayloadFromLocalCookie } from './local-session/helpers'
import type { createAuthAwareGraphqlFetch } from '@/api/graphql-fetch'

export type AuthenticationPayload = {
  username: string
  id: number
} | null

export interface AuthContextValue {
  authenticationPayload: AuthenticationPayload
  authorizationPayload: AuthorizationPayload | null
  refreshAuth: (session: Session | null) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({
  children,
  unauthenticatedAuthorizationPayload,
}: {
  children: ReactNode
  unauthenticatedAuthorizationPayload?: AuthorizationPayload
}) {
  const [authenticationPayload, setAuthenticationPayload] = useState(
    getAuthPayloadFromLocalCookie()
  )

  function refreshAuth(session: Session | null) {
    setAuthenticationPayload(getAuthPayloadFromSession(session))
  }

  useEffect(() => {
    const refreshWhenVisible = () => {
      if (document.visibilityState)
        setAuthenticationPayload(getAuthPayloadFromLocalCookie())
    }
    document.addEventListener('visibilitychange', refreshWhenVisible) //on tab focus change
    window.addEventListener('online', () => refreshWhenVisible) //on reconnect

    return () => {
      document.addEventListener('visibilitychange', refreshWhenVisible)
      window.removeEventListener('online', () => refreshWhenVisible)
    }
  }, [])

  const authorizationPayload = useAuthorizationPayload(
    authenticationPayload,
    unauthenticatedAuthorizationPayload
  )

  return (
    <AuthContext.Provider
      value={{
        authenticationPayload,
        authorizationPayload,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function getAuthPayloadFromSession(session: Session | null) {
  return session
    ? {
        username: (session.identity.traits as { username: string }).username,
        id: (
          session.identity.metadata_public as {
            legacy_id: number
          }
        )?.legacy_id,
      }
    : null
}

function useAuthorizationPayload(
  authenticationPayload: AuthenticationPayload,
  unauthenticatedAuthorizationPayload?: AuthorizationPayload
) {
  async function fetchAuthorizationPayload(
    authenticationPayload: AuthenticationPayload
  ): Promise<AuthorizationPayload> {
    if (authenticationPayload === null) {
      return unauthenticatedAuthorizationPayload ?? {}
    }

    const graphQLFetch = (await import('@/api/graphql-fetch')) as {
      createAuthAwareGraphqlFetch: typeof createAuthAwareGraphqlFetch
    }

    const fetch = graphQLFetch.createAuthAwareGraphqlFetch(
      authenticationPayload
    )
    const data = (await fetch(
      JSON.stringify({
        query: `
          query {
            authorization
          }
        `,
      })
    )) as { authorization: AuthorizationPayload }
    return data.authorization
  }

  const [authorizationPayload, setAuthorizationPayload] =
    useState<AuthorizationPayload | null>(
      unauthenticatedAuthorizationPayload ?? null
    )

  useEffect(() => {
    void fetchAuthorizationPayload(authenticationPayload).then(
      (authorizationPayload) => {
        setAuthorizationPayload(authorizationPayload)
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticationPayload, authenticationPayload?.id])

  return authorizationPayload
}
