import { gql } from 'graphql-request'
import NProgress from 'nprogress'
import { useSWRConfig } from 'swr'

import { useMutationFetch } from './helper/use-mutation-fetch'
import { useSWRCacheMutate } from './helper/use-swr-cache-mutate'
import { useEntityId } from '@/contexts/entity-id-context'
import {
  ThreadCreateCommentInput,
  ThreadCreateThreadInput,
  ThreadSetCommentStateInput,
  ThreadSetThreadArchivedInput,
  ThreadSetThreadStateInput,
} from '@/fetcher/graphql-types/operations'

const threadCacheShouldMutate = (key: string) => {
  return key.startsWith('$inf$') && key.includes('query getAllThreads')
}

const threadArchiveMutation = gql`
  mutation threadSetArchived($input: ThreadSetThreadArchivedInput!) {
    thread {
      setThreadArchived(input: $input) {
        success
      }
    }
  }
`

export function useThreadArchivedMutation() {
  const entityId = useEntityId()
  const mutationFetch = useMutationFetch()
  const mutateSWRCache = useSWRCacheMutate()
  const { mutate } = useSWRConfig()

  return async function (input: ThreadSetThreadArchivedInput) {
    NProgress.start()

    const success = await mutationFetch(threadArchiveMutation, input)

    if (success) {
      await mutate(`comments::${entityId}`)
      mutateSWRCache(threadCacheShouldMutate)
      NProgress.done()
    }
    return success
  }
}

const setThreadStateMutation = gql`
  mutation threadSetState($input: ThreadSetThreadStateInput!) {
    thread {
      setThreadState(input: $input) {
        success
      }
    }
  }
`

export function useSetThreadStateMutation() {
  const entityId = useEntityId()
  const mutationFetch = useMutationFetch()
  const mutateSWRCache = useSWRCacheMutate()
  const { mutate } = useSWRConfig()

  return async function (input: ThreadSetThreadStateInput) {
    const success = await mutationFetch(setThreadStateMutation, input)

    if (success) {
      await mutate(`comments::${entityId}`)
      mutateSWRCache(threadCacheShouldMutate)
    }
    return success
  }
}

const setCommentStateMutation = gql`
  mutation threadSetCommentState($input: ThreadSetCommentStateInput!) {
    thread {
      setCommentState(input: $input) {
        success
      }
    }
  }
`

export function useSetCommentStateMutation() {
  const entityId = useEntityId()
  const mutationFetch = useMutationFetch()
  const mutateSWRCache = useSWRCacheMutate()
  const { mutate } = useSWRConfig()

  return async function (input: ThreadSetCommentStateInput) {
    const success = await mutationFetch(setCommentStateMutation, input)

    if (success) {
      await mutate(`comments::${entityId}`)
      mutateSWRCache(threadCacheShouldMutate)
    }
    return success
  }
}

const createThreadMutation = gql`
  mutation createThread($input: ThreadCreateThreadInput!) {
    thread {
      createThread(input: $input) {
        success
      }
    }
  }
`

export function useCreateThreadMutation() {
  const mutationFetch = useMutationFetch()
  const mutateSWRCache = useSWRCacheMutate()
  const { mutate } = useSWRConfig()

  return async function (input: ThreadCreateThreadInput) {
    const success = await mutationFetch(createThreadMutation, input)

    if (success) {
      await mutate(`comments::${input.objectId}`)
      mutateSWRCache(threadCacheShouldMutate)
    }
    return success
  }
}

const createCommentMutation = gql`
  mutation createComment($input: ThreadCreateCommentInput!) {
    thread {
      createComment(input: $input) {
        success
      }
    }
  }
`

export function useCreateCommentMutation() {
  const mutationFetch = useMutationFetch()
  const mutateSWRCache = useSWRCacheMutate()
  const { mutate } = useSWRConfig()
  const entityId = useEntityId()

  return async function (input: ThreadCreateCommentInput) {
    const success = await mutationFetch(createCommentMutation, input)

    if (success) {
      await mutate(`comments::${entityId}`)
      mutateSWRCache(threadCacheShouldMutate)
    }
    return success
  }
}
