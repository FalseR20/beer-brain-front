import {createContext, ReactNode, useEffect, useState} from "react";
import {CNotification} from "../dataclasses.ts";
import {getUnreadNotifications, markNotificationsRead} from "../fetches.tsx";

export const NotificationsContext = createContext<{
  notifications?: CNotification[]
  wasChanged: boolean
  markRead: () => void
}>({
  notifications: undefined,
  wasChanged: false,
  markRead: () => {}
})

export function NotificationsContextWrapper(props: {
  children: ReactNode,
}) {
  const [notifications, setNotifications] = useState<CNotification[] | undefined>(undefined);
  const [latestId, setLatestId] = useState<number | undefined>(undefined)
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
        setLatestId(newNotifications[newNotifications.length - 1].id);
        setWasChanged(true);
      })
    }
  }, []);

  function markRead() {
    if (latestId) {
      markNotificationsRead(latestId).then(() => {
        setNotifications(undefined)
      })
    }
  }

  return (
    <NotificationsContext.Provider value={{notifications, wasChanged, markRead}}>
      {props.children}
    </NotificationsContext.Provider>
  )
}