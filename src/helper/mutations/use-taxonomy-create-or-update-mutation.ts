import { TaxonomyTypeCreateOptions } from '@serlo/api'
import { gql } from 'graphql-request'
import { useRouter } from 'next/router'

import { showToastNotice } from '../show-toast-notice'
import { mutationFetch } from './helper'
import { TaxonomyCreateOrUpdateMutationData } from './use-set-entity-mutation/types'
import { getRequiredString } from './use-set-entity-mutation/use-set-entity-mutation'
import { useAuthentication } from '@/auth/use-authentication'
import { useLoggedInData } from '@/contexts/logged-in-data-context'

export function useTaxonomyCreateOrUpdateMutation() {
  const auth = useAuthentication()
  const loggedInData = useLoggedInData()
  const router = useRouter()

  return async (data: TaxonomyCreateOrUpdateMutationData) => {
    if (!auth || !loggedInData) {
      showToastNotice('Please make sure you are logged in!', 'warning')
      return false
    }
    if (!data.__typename || data.__typename !== 'TaxonomyTerm') return false

    try {
      const input = {
        id: data.id,
        name: getRequiredString(loggedInData, 'name', data.term.name),
        description: getRequiredString(
          loggedInData,
          'description',
          data.description
        ),
      }

      // reafactor as soon as we don't rely on legacy any more…
      // only for create
      const [, , , , typeNumberString, parentIdString] =
        router.asPath.split('/') // taxonomy/term/create/4/1390

      const success = data.id
        ? await mutationFetch(
            auth,
            taxonomySetMutation,
            input,
            loggedInData?.strings.mutations.errors
          )
        : await mutationFetch(
            auth,
            taxonomyCreateMutation,
            {
              ...input,
              parentId: parseInt(parentIdString),
              taxonomyType: getTaxonomyType(typeNumberString),
            },
            loggedInData?.strings.mutations.errors
          )

      if (success) {
        showToastNotice(loggedInData.strings.mutations.success.save, 'success')
        window.location.href = `/${data.id ?? parentIdString}`
        return true
      }
      return false
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('probably missing value?')
      return false
    }
  }
}

function getTaxonomyType(idString?: string) {
  if (!idString || !parseInt(idString))
    throw 'invalid url -> unknown taxonomy type'

  const id = parseInt(idString)

  const topicIds = [4, 16, 33, 42, 48, 53]
  const exerciseFolderIds = [9, 19, 36, 45, 51, 56]

  if (topicIds.includes(id)) return TaxonomyTypeCreateOptions.Topic
  if (exerciseFolderIds.includes(id))
    return TaxonomyTypeCreateOptions.ExerciseFolder

  throw 'unknown taxonomy type'
}

const taxonomySetMutation = gql`
  mutation taxonomyTermSetNameAndDescription(
    $input: TaxonomyTermSetNameAndDescriptionInput!
  ) {
    taxonomyTerm {
      setNameAndDescription(input: $input) {
        success
      }
    }
  }
`

const taxonomyCreateMutation = gql`
  mutation taxonomyCreate($input: TaxonomyTermCreateInput!) {
    taxonomyTerm {
      create(input: $input) {
        success
      }
    }
  }
`
