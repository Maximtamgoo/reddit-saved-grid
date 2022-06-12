import { createContext } from 'react'

type AuthContextType = {
  isAuthed: boolean,
  loading: boolean,
  signInWithReddit: () => void,
  signOut: () => void
}

export default createContext<AuthContextType>({
  isAuthed: false, loading: true, signInWithReddit: () => null, signOut: () => null
})