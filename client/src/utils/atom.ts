import { atom } from 'jotai'

export const currentUserAtom = atom<String | null | undefined>(null)