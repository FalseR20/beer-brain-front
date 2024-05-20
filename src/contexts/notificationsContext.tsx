import {createContext, ReactNode, useEffect, useState} from "react";
import {CNotification} from "../dataclasses.ts";
import {getUnreadNotifications} from "../fetches.tsx";

export const NotificationsContext = createContext<{
  notifications?: CNotification[]
  wasChanged: boolean
}>({
  notifications: undefined,
  wasChanged: false
})

export function NotificationsContextWrapper(props: {
  children: ReactNode,
}) {
  const [notifications, setNotifications] = useState<CNotification[] | undefined>(undefined);
  const [wasChanged, setWasChanged] = useState(false);

  useEffect(() => {
    if (wasChanged) {
      setWasChanged(false);
    }
  }, [wasChanged]);

  useEffect(() => {
    if (!wasChanged) {
      getUnreadNotifications().then((newNotifications) => {
        setNotifications(newNotifications);
        setWasChanged(true);
      })
    }
  }, []);

  return (
    <NotificationsContext.Provider value={{notifications, wasChanged}}>
      {props.children}
    </NotificationsContext.Provider>
  )
}