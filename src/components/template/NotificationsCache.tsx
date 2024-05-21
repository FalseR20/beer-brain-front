import {createContext, ReactNode} from "react";

type NotificationCacheType = Map<number, Promise<string>>

export const NotificationCacheContext = createContext<{
  cache: NotificationCacheType
}>({
  cache: new Map([])
})

export function NotificationCacheWrapper(props: {
  children: ReactNode,
}) {

  return (
    <NotificationCacheContext.Provider value={{cache: new Map([])}}>
      {props.children}
    </NotificationCacheContext.Provider>
  )
}