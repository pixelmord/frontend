import { EditorProps } from '@edtr-io/core'
import { Dispatch, SetStateAction } from 'react'
import { debounce } from 'ts-debounce'

import { LooseEdtrData } from '../serlo-editor'
import { useLoggedInData } from '@/contexts/logged-in-data-context'

export interface LocalStorageNoticeProps {
  useStored: boolean
  setUseStored: Dispatch<SetStateAction<boolean>>
}

export function LocalStorageNotice({
  useStored,
  setUseStored,
}: LocalStorageNoticeProps) {
  const loggedInData = useLoggedInData()
  if (!loggedInData) return null
  const storageStrings = loggedInData.strings.editor.edtrIo.localStorage

  const stored = getStateFromLocalStorage()

  if (!stored) return null

  return (
    <div className="bg-brand-100 rounded-2xl m-side mt-12 p-side">
      <>
        {storageStrings[useStored ? 'restoreInitial' : 'found']}
        <br />
        <button
          className="serlo-button-blue mt-2"
          onClick={() => {
            if (useStored) {
              storeStateToLocalStorage(undefined)
              setUseStored(false)
            } else setUseStored(true)
          }}
        >
          {storageStrings[useStored ? 'restoreInitialButton' : 'foundButton']}
        </button>
      </>
    </div>
  )
}

export function getStateFromLocalStorage() {
  const edtr = localStorage.getItem('edtr')
  if (!edtr) return

  const storedStates = JSON.parse(edtr) as LooseEdtrData
  return storedStates[window.location.pathname]
}

export function storeStateToLocalStorage(
  state?: EditorProps['initialState'] | null
) {
  // eslint-disable-next-line no-console
  console.log('edtr: saving state in browser localstorage')
  const currentValue = localStorage.getItem('edtr')
  const edtr = currentValue ? (JSON.parse(currentValue) as LooseEdtrData) : {}

  edtr[window.location.pathname] = state
  localStorage.setItem('edtr', JSON.stringify(edtr))
}

export const debouncedStoreToLocalStorage = debounce(
  (state?: EditorProps['initialState'] | null) =>
    storeStateToLocalStorage(state),
  5000
)
