import { createContext } from 'react'

type AuthContextType = {
  isAuthed: boolean,
  loading: boolean,
  name: string,
  signInWithReddit: () => void,
  signOut: () => void
}

export default createContext<AuthContextType>({
  isAuthed: false, loading: true, name: '', signInWithReddit: () => null, signOut: () => null
})