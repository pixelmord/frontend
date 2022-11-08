import { Root, List } from '@radix-ui/react-navigation-menu'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import { Item } from './item'
import { useInstanceData } from '@/contexts/instance-context'

const AuthItems = dynamic<{}>(() =>
  import('./auth-items').then((mod) => mod.AuthItems)
)

export function Menu() {
  const { headerData } = useInstanceData()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <Root>
      <List className="md:text-right block m-0 p-0 relative">
        {headerData.map((link) => (
          <Item key={link.title} link={link} />
        ))}
        {mounted ? <AuthItems /> : null}
      </List>
    </Root>
  )
}