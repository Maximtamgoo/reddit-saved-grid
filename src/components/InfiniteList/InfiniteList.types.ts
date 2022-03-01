import { ReactNode } from 'react'

type Props = {
  fetchMore: () => void,
  hasMore: boolean,
  loader: ReactNode,
  children: ReactNode
}

export default Props