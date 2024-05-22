import {createContext, ReactNode, useEffect, useState} from "react";
import {CNotification} from "../dataclasses.ts";
import {deleteNotification, getNotifications} from "../fetches.tsx";

export const NotificationsContext = createContext<{
  notifications?: CNotification[], // unread
  nNotifications?: number,
  markRead: (id: number) => void
}>({
  notifications: undefined,
  nNotifications: undefined,
  markRead: () => {
  }
})

export function NotificationsContextWrapper(props: {
  children: ReactNode,
}) {
  const [notifications, setNotifications] = useState<CNotification[] | undefined>(undefined);

  // Fetch loop can be realized, but it's expensive now
  useEffect(() => {
    getNotifications(false).then(setNotifications)
  }, []);

  function markRead(id: number) {
    deleteNotification(id).then(() => {
      if (notifications) {
        const newNotifications = notifications.map(value => {
          if (value.id === id) {
            value.is_read = true
          }
          return value
        })
        setNotifications(newNotifications)
      }
    })
  }

  const nNotifications = notifications?.reduce((accumulator, currentValue) => accumulator + +!currentValue.is_read, 0)

  return (
    <NotificationsContext.Provider value={{notifications, nNotifications, markRead}}>
      {props.children}
    </NotificationsContext.Provider>
  )
}