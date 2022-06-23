import { faEye } from '@fortawesome/free-solid-svg-icons/faEye'
import clsx from 'clsx'
import { Fragment } from 'react'

import { FaIcon } from '../fa-icon'
import { Link } from '@/components/content/link'
import { TimeAgo } from '@/components/time-ago'
import { UserLink } from '@/components/user/user-link'
import { useInstanceData } from '@/contexts/instance-context'
import type { CompBaseProps, UnrevisedRevisionsData } from '@/data-types'
import { getTranslatedType } from '@/helper/get-translated-type'
import { hasOwnPropertyTs } from '@/helper/has-own-property-ts'

export type UnrevisedRevisionEntity =
  UnrevisedRevisionsData['subjects'][number]['unrevisedEntities']['nodes'][number]

export interface UnrevisedEntityProps {
  entity: UnrevisedRevisionEntity
  isOwn?: boolean
}

function getNodes(entity: UnrevisedRevisionEntity) {
  if (hasOwnPropertyTs(entity, 'revisions')) {
    return entity.revisions?.nodes
  }
  if (hasOwnPropertyTs(entity, 'solutionRevisions')) {
    return entity.solutionRevisions.nodes
  }
  return []
}

function getTitle(entity: UnrevisedRevisionEntity) {
  if (hasOwnPropertyTs(entity, 'currentRevision') && entity.currentRevision) {
    if (hasOwnPropertyTs(entity.currentRevision, 'title')) {
      return entity.currentRevision.title
    }
  }

  if (hasOwnPropertyTs(entity, 'revisions')) {
    const node = entity.revisions.nodes[0]
    if (node && hasOwnPropertyTs(node, 'title')) {
      return node.title
    }
  }

  return entity.id.toString()
}

export function UnrevisedEntity({ entity, isOwn }: UnrevisedEntityProps) {
  const { strings } = useInstanceData()

  const nodes = getNodes(entity)

  const title = getTitle(entity)

  const isProbablyNew = entity.currentRevision === null

  return (
    <div className="mx-side mb-10">
      <Link
        title={strings.revisionHistory.viewLabel}
        href={entity.alias}
        className="font-bold"
      >
        <b>{title}</b>
      </Link>{' '}
      <span>| {getTranslatedType(strings, entity.__typename)}</span>
      {renderTable()}
    </div>
  )

  function renderTable() {
    return (
      <table className="mt-1 border-collapse w-full relative">
        <tbody>
          {nodes.map((revision) => (
            <Fragment key={revision.id}>{renderRevision(revision)}</Fragment>
          ))}
        </tbody>
      </table>
    )
  }

  function renderRevision(revision: ReturnType<typeof getNodes>[number]) {
    if (!revision) return null
    const viewUrl = `/entity/repository/compare/${entity.id}/${revision.id}`
    const isProbablyWIP = checkWIP(revision.changes)

    return (
      <tr className={isProbablyWIP ? 'opacity-50' : undefined}>
        <Td className="pl-0 w-1/2">
          <Link href={viewUrl} className="hover:no-underline text-black">
            {revision.changes || '–'}
          </Link>
          {renderLabels(isProbablyWIP)}
        </Td>
        {isOwn ? null : (
          <Td>
            <UserLink user={revision.author} />
            {revision.author.isNewAuthor && renderAuthorLabel()}
          </Td>
        )}
        <Td className="w-1/6">
          <TimeAgo datetime={new Date(revision.date)} dateAsTitle />
        </Td>
        <Td centered className="w-1/6">
          <Link
            className="serlo-button-light my-0 mx-auto text-base"
            title={strings.revisionHistory.viewLabel}
            href={viewUrl}
          >
            <FaIcon icon={faEye} />
          </Link>
        </Td>
      </tr>
    )
  }

  function renderLabels(isProbablyWIP: boolean) {
    const { newLabelNote, newLabelText, wipLabelNote, wipLabelText } =
      strings.unrevisedRevisions
    return (
      <>
        {' '}
        {isProbablyNew && renderLabel(newLabelText, newLabelNote)}{' '}
        {isProbablyWIP && renderLabel(wipLabelText, wipLabelNote)}
      </>
    )
  }

  function renderAuthorLabel() {
    const { newAuthorText, newAuthorNote } = strings.unrevisedRevisions
    return renderLabel(newAuthorText, newAuthorNote)
  }

  function renderLabel(text: string, note?: string) {
    return (
      <span
        className="serlo-button-light cursor-default text-base"
        title={note}
      >
        {text}
      </span>
    )
  }

  // test: placeholder until we get this info from the api
  function checkWIP(changes: string) {
    const wipStrings = [
      'wip',
      'in arbeit',
      'work in progress',
      'noch nicht freigeben',
      'zwischenspeicherung',
      'noch nicht fertig',
      'im aufbau',
    ]
    return wipStrings.some((testStr) => changes.toLowerCase().includes(testStr))
  }
}

const Td: CompBaseProps<{
  centered?: boolean
  className?: string
}> = ({ children, centered, className }) => (
  <td
    className={clsx(className, 'serlo-td', centered && 'text-center')}
    style={{ borderLeftColor: 'transparent', borderRightColor: 'transparent' }}
  >
    {children}
  </td>
)
