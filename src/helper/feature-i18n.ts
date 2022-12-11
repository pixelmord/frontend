import { mergeDeepRight } from 'ramda'

import { InstanceData, UuidWithRevType } from '@/data-types'
import {
  instanceData as deInstanceData,
  instanceLandingData as deInstanceLandingData,
  serverSideStrings as deServerSideStrings,
  loggedInData as deLoggedInData,
} from '@/data/de'
import {
  instanceData as enInstanceData,
  serverSideStrings as enServerSideStrings,
  instanceLandingData as enInstanceLandingData,
  loggedInData as enLoggedInData,
} from '@/data/en'
import {
  instanceData as esInstanceData,
  instanceLandingData as esInstanceLandingData,
  serverSideStrings as esServerSideStrings,
  loggedInData as esLoggedInData,
} from '@/data/es'
import {
  instanceData as frInstanceData,
  serverSideStrings as frServerSideStrings,
  instanceLandingData as frInstanceLandingData,
  loggedInData as frLoggedInData,
} from '@/data/fr'
import {
  instanceData as hiInstanceData,
  serverSideStrings as hiServerSideStrings,
  instanceLandingData as hiInstanceLandingData,
  loggedInData as hiLoggedInData,
} from '@/data/hi'
import {
  instanceData as taInstanceData,
  serverSideStrings as taServerSideStrings,
  loggedInData as taLoggedInData,
  instanceLandingData as taInstanceLandingData,
} from '@/data/ta'
import { Instance } from '@/fetcher/graphql-types/operations'

export const languages: Instance[] = Object.values(Instance)

export function parseLanguageSubfolder(alias: string) {
  for (const lang of languages) {
    if (alias.startsWith(`/${lang}/`) || alias == `/${lang}`) {
      const subalias = alias.substring(3)
      return { alias: subalias === '' ? '/' : subalias, instance: lang }
    }
  }
  return { alias, instance: Instance.De }
}

export function isOnLanguageSubdomain() {
  if (typeof window === 'undefined') return false
  else {
    for (const lang of languages) {
      if (window.location.host.startsWith(`${lang}.`)) return true
    }
  }
  return false
}

export function getInstanceDataByLang(lang: Instance) {
  const enData = enInstanceData

  const data =
    lang == Instance.De
      ? deInstanceData
      : lang == Instance.Es
      ? esInstanceData
      : lang == Instance.Fr
      ? frInstanceData
      : lang == Instance.Ta
      ? taInstanceData
      : lang == Instance.Hi
      ? hiInstanceData
      : enInstanceData

  return mergeDeepRight(enData, data) as typeof enInstanceData
}

export function getServerSideStrings(lang: string) {
  const enData = enServerSideStrings

  const data =
    lang == Instance.De
      ? deServerSideStrings
      : lang == Instance.Es
      ? esServerSideStrings
      : lang == Instance.Fr
      ? frServerSideStrings
      : lang == Instance.Ta
      ? taServerSideStrings
      : lang == Instance.Hi
      ? hiServerSideStrings
      : enServerSideStrings

  return mergeDeepRight(enData, data) as typeof enServerSideStrings
}

export function getLandingData(lang: string) {
  const enData = enInstanceLandingData

  const data =
    lang == Instance.De
      ? deInstanceLandingData
      : lang == Instance.Es
      ? esInstanceLandingData
      : lang == Instance.Fr
      ? frInstanceLandingData
      : lang == Instance.Ta
      ? taInstanceLandingData
      : lang == Instance.Hi
      ? hiInstanceLandingData
      : enInstanceLandingData

  return mergeDeepRight(enData, data) as typeof enInstanceLandingData
}

export function getLoggedInData(lang: string) {
  const enData = enLoggedInData

  const data =
    lang == Instance.De
      ? deLoggedInData
      : lang == Instance.Es
      ? esLoggedInData
      : lang == Instance.Fr
      ? frLoggedInData
      : lang == Instance.Ta
      ? taLoggedInData
      : lang == Instance.Hi
      ? hiLoggedInData
      : enLoggedInData

  return mergeDeepRight(enData, data) as typeof enLoggedInData
}

export function getEntityStringByTypename(
  typename: UuidWithRevType | undefined,
  strings: InstanceData['strings']
) {
  const typenameNoRevs = typename?.replace('Revision', '')
  const lookup = {
    Page: strings.entities.page,
    Article: strings.entities.article,
    Video: strings.entities.video,
    Applet: strings.entities.applet,
    CoursePage: strings.entities.coursePage,
    Exercise: strings.entities.exercise,
    GroupedExercise: strings.entities.groupedExercise,
    ExerciseGroup: strings.entities.exerciseGroup,
    Event: strings.entities.event,
    Course: strings.entities.course,
    TaxonomyTerm: strings.entities.taxonomyTerm,
    Solution: strings.entities.solution,
    User: strings.entities.user,
    Comment: strings.entities.comment,
    fallback: strings.entities.content,
  }

  if (typenameNoRevs && typenameNoRevs in lookup) {
    return lookup[typenameNoRevs as keyof typeof lookup]
  }
  return lookup.fallback
}
