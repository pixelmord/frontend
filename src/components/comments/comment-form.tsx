import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight'
import { faReply } from '@fortawesome/free-solid-svg-icons/faReply'
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner'
import clsx from 'clsx'
import { useState, KeyboardEvent, useRef, ChangeEvent } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

import { FaIcon } from '../fa-icon'
import { useInstanceData } from '@/contexts/instance-context'
import { isMac } from '@/helper/client-detection'

interface CommentFormProps {
  onSend: (
    content: string,
    reply?: boolean,
    threadId?: string
  ) => Promise<boolean | number>
  placeholder: string
  reply?: boolean
  threadId?: string
}

export function CommentForm({
  placeholder,
  onSend,
  reply,
  threadId,
}: CommentFormProps) {
  const [commentValue, setCommentValue] = useState('')
  const { strings } = useInstanceData()
  const [isSending, setIsSending] = useState(false)
  const textareaRef = useRef<null | HTMLTextAreaElement>(null)

  async function onSendAction() {
    if (commentValue.length < 1) {
      textareaRef.current?.focus()
      return
    }
    setIsSending(true)
    const success = await onSend(commentValue, reply, threadId)
    setIsSending(false)
    if (success) setCommentValue('')
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.code === 'Enter' && e.metaKey) void onSendAction()
  }

  const sendTitle = `${strings.comments.submit}   ${
    isMac ? '⌘' : strings.keys.ctrl
  }↵`

  const formId = `comment-form${threadId ?? ''}`

  return (
    <div
      className={clsx(
        'mx-side mt-4 mb-7 flex items-center rounded-2xl',
        'bg-brandgreen-lighter focus-within:bg-brandgreen-light',
        'transition-colors duration-200 ease-in py-1'
      )}
    >
      <label htmlFor={formId} className="sr-only">
        {placeholder}
      </label>
      <TextareaAutosize
        value={commentValue}
        ref={textareaRef}
        id={formId}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
          setCommentValue(event.target.value)
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        minRows={1}
        className={clsx(
          'serlo-input-font-reset w-full text-lg',
          'text-black border-0 bg-transparent outline-none resize-none',
          reply ? 'pr-14 pl-4' : 'pr-14 pl-4',
          'placeholder-brandgreen'
        )}
      />
      <button
        title={sendTitle}
        onClick={onSendAction}
        className={clsx(
          'serlo-button-green pl-2 self-end',
          reply ? 'text-base w-8 h-8 mr-1' : 'text-2xl w-10 my-1 mr-2'
        )}
      >
        <FaIcon
          icon={isSending ? faSpinner : reply ? faReply : faArrowRight}
          className={clsx(
            reply ? '' : 'pl-0.5',
            isSending && 'animate-spin-slow'
          )}
        />
      </button>
    </div>
  )
}
