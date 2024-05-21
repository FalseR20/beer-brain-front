import {createContext, ReactNode, useEffect, useState} from "react";
import {CNotification} from "../dataclasses.ts";
import {getNotifications, markNotification} from "../fetches.tsx";

export const NotificationsContext = createContext<{
  notifications?: CNotification[], // unread
  markRead: (id: number) => void
}>({
  notifications: undefined,
  markRead: () => {
  }
})

export function NotificationsContextWrapper(props: {
  children: ReactNode,
}) {
  const [notifications, setNotifications] = useState<CNotification[] | undefined>(undefined);

  useEffect(() => {
    getNotifications(false).then(setNotifications)
  }, []);

  function markRead(id: number) {
    markNotification(id).then(() => {
      if (notifications) {
        setNotifications(notifications.filter(notification => notification.id === id))
      }
    })
  }

  return (
    <NotificationsContext.Provider value={{notifications, markRead}}>
      {props.children}
    </NotificationsContext.Provider>
  )
}