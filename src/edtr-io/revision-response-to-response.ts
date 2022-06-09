import { RevisionUuidQuery } from '@/fetcher/graphql-types/operations'
import { MainUuidType } from '@/fetcher/query-types'
import { hasOwnPropertyTs } from '@/helper/has-own-property-ts'

export function revisionResponseToResponse(
  uuid: RevisionUuidQuery['uuid']
): MainUuidType | null {
  if (!uuid) return null

  if (!hasOwnPropertyTs(uuid, 'repository')) return null

  const { license, trashed, instance, id, alias } = uuid.repository
  const repositoryFields = {
    license,
    trashed,
    id,
    instance,
    alias,
  }

  const title = hasOwnPropertyTs(uuid, 'title') ? uuid.title : ''
  const content = uuid.content
  const metaTitle = hasOwnPropertyTs(uuid, 'metaTitle') ? uuid.metaTitle : ''
  const metaDescription = hasOwnPropertyTs(uuid, 'metaDescription')
    ? uuid.metaDescription
    : ''
  const date = '' // just to make type happy, not used

  const taxonomyTerms = hasOwnPropertyTs(uuid.repository, 'taxonomyTerms')
    ? uuid.repository.taxonomyTerms
    : { nodes: [{}] }

  if (uuid.__typename === 'AppletRevision') {
    uuid.__typename
    return {
      __typename: 'Applet',
      currentRevision: {
        id: uuid.id,
        url: uuid.url,
        title,
        content,
        metaTitle,
        metaDescription,
        date,
      },
      ...repositoryFields,
      taxonomyTerms,
      revisions: uuid.repository.revisions,
      date,
    }
  }

  if (uuid.__typename === 'ArticleRevision') {
    uuid.__typename
    return {
      __typename: 'Article',
      date,
      currentRevision: {
        id: uuid.id,
        title,
        content,
        metaTitle,
        metaDescription,
        date,
      },
      taxonomyTerms,
      ...repositoryFields,
      revisions: uuid.repository.revisions,
    }
  }

  if (uuid.__typename === 'CourseRevision') {
    uuid.__typename
    return {
      __typename: 'Course',
      ...repositoryFields,
      pages: uuid.repository.pages,
      taxonomyTerms,
    }
  }

  if (uuid.__typename === 'CoursePageRevision') {
    uuid.__typename
    return {
      __typename: 'CoursePage',
      currentRevision: {
        id: uuid.id,
        alias: uuid.alias,
        title,
        content,
        date,
      },
      ...repositoryFields,
      revisions: uuid.repository.revisions,
      course: uuid.repository.course,
      date,
    }
  }

  if (uuid.__typename === 'EventRevision') {
    uuid.__typename
    return {
      __typename: 'Event',
      currentRevision: {
        id: uuid.id,
        title,
        content,
      },
      ...repositoryFields,
      taxonomyTerms,
    }
  }

  if (uuid.__typename === 'ExerciseRevision') {
    uuid.__typename
    return {
      __typename: 'Exercise',
      currentRevision: {
        content,
        date,
      },
      taxonomyTerms,
      ...repositoryFields,
      revisions: uuid.repository.revisions,
      date,
    }
  }

  if (uuid.__typename === 'ExerciseGroupRevision') {
    uuid.__typename
    return {
      __typename: 'ExerciseGroup',
      currentRevision: {
        id: uuid.id,
        content,
        cohesive: uuid.cohesive,
        date,
      },
      exercises: uuid.repository.exercises,
      taxonomyTerms,
      ...repositoryFields,
      revisions: uuid.repository.revisions,
      date,
    }
  }

  if (uuid.__typename === 'GroupedExerciseRevision') {
    uuid.__typename
    return {
      __typename: 'GroupedExercise',
      currentRevision: {
        content,
        date,
      },
      exerciseGroup: uuid.repository.exerciseGroup,
      ...repositoryFields,
      revisions: uuid.repository.revisions,
      date,
    }
  }

  // probably not needed
  if (uuid.__typename === 'PageRevision') {
    uuid.__typename
    return {
      __typename: 'Page',
      currentRevision: {
        id: uuid.id,
        title,
        content,
      },
      ...repositoryFields,
    }
  }

  if (uuid.__typename === 'SolutionRevision') {
    uuid.__typename
    return {
      __typename: 'Solution',
      currentRevision: {
        content,
      },
      exercise: uuid.repository.exercise,
      ...repositoryFields,
      trashed: uuid.trashed,
    }
  }

  if (uuid.__typename === 'VideoRevision') {
    uuid.__typename
    return {
      __typename: 'Video',
      currentRevision: {
        id: uuid.id,
        url: uuid.url,
        title,
        content,
      },
      taxonomyTerms,
      ...repositoryFields,
      revisions: uuid.repository.revisions,
    }
  }

  return null
}
