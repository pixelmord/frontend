import { MainUuidType } from './query-types'
import { BreadcrumbsData, UuidType } from '@/data-types'
import { hasOwnPropertyTs } from '@/helper/has-own-property-ts'

const rootIdsToLandingAlias: Record<number, string> = {
  19767: '/mathe',
  48492: '/informatik',
  41108: '/physik',
  182154: '/lerntipps',
  24706: '/chemie',
  58771: '/nachhaltigkeit',
  23950: '/biologie',
  25985: '/englisch',
  79157: '/politik',
  19882: '/community',
}

export function createBreadcrumbs(uuid: MainUuidType) {
  if (uuid.__typename === UuidType.TaxonomyTerm) {
    if (uuid.navigation?.path.nodes) {
      return compat(uuid.navigation?.path.nodes)
    }
  }

  if (uuid.__typename === UuidType.CoursePage) {
    return compat(buildFromTaxTerms(uuid.course?.taxonomyTerms.nodes))
  }

  if (
    uuid.__typename === UuidType.Article ||
    uuid.__typename === UuidType.Video ||
    uuid.__typename === UuidType.Applet ||
    uuid.__typename === UuidType.Exercise ||
    uuid.__typename === UuidType.ExerciseGroup ||
    uuid.__typename === UuidType.Course
  ) {
    return compat(buildFromTaxTerms(uuid.taxonomyTerms.nodes))
  }

  function buildFromTaxTerms(
    taxonomyPaths:
      | Extract<
          MainUuidType,
          { __typename: 'Article' }
        >['taxonomyTerms']['nodes']
      | undefined
  ) {
    if (taxonomyPaths === undefined) return undefined
    let breadcrumbs
    let backup

    for (const child of taxonomyPaths) {
      if (!child.navigation) continue
      const path = child.navigation.path.nodes
      if (!breadcrumbs || breadcrumbs.length > path.length) {
        // compat: some paths are short-circuited, ignore them
        if (
          path.some((x) => x.label === 'Mathematik') &&
          !path.some((x) => x.label === 'Alle Themen')
        ) {
          if (!backup || backup.length > path.length) {
            backup = path
          }
          continue
        }

        breadcrumbs = path
      }
    }

    return breadcrumbs ?? backup
  }

  function compat(breadcrumbs: BreadcrumbsData | undefined) {
    if (!breadcrumbs) return breadcrumbs

    if (uuid.__typename == UuidType.TaxonomyTerm) {
      breadcrumbs = breadcrumbs.slice(0, -1) // compat: remove last entry because it is the entry itself
    }

    breadcrumbs = breadcrumbs.filter((entry) => entry.url && entry.label) // compat: remove empty entries
    breadcrumbs = breadcrumbs.filter((entry) => entry.label !== 'Alle Themen') // compat/test: remove "Alle Themen" because landing pages offer a similar overview
    const shortened: BreadcrumbsData = []
    breadcrumbs.map((entry, i, arr) => {
      const maxItems = 4
      const overflow = arr.length > maxItems
      const itemsToRemove = arr.length - maxItems
      const ellipsesItem = overflow && i == 2

      if (overflow && i > 2 && i < 1 + itemsToRemove) return
      // special case
      if (arr.length - itemsToRemove > 4 && i === 1) return
      if (ellipsesItem) {
        shortened.push({ label: '', ellipsis: true })
      } else {
        shortened.push(entry)
      }
    })

    // use correct urls for subject landing pages
    if (
      breadcrumbs[0].id &&
      !isNaN(breadcrumbs[0].id) &&
      hasOwnPropertyTs(rootIdsToLandingAlias, breadcrumbs[0].id)
    ) {
      breadcrumbs[0].url = rootIdsToLandingAlias[breadcrumbs[0].id]
    }

    return shortened
  }
}
