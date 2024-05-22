import {BsBell, BsBellFill} from "react-icons/bs";
import {Badge, Button, Toast, ToastBody, ToastContainer, ToastHeader} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {NotificationsContext} from "../../contexts/notificationsContext.tsx";
import {NotificationCacheWrapper} from "../../contexts/notificationsCache.tsx";
import {useTranslation} from "react-i18next";
import moment from "moment/moment";
import {NotificationMessage} from "./NotificationMessage.tsx";

export default function Notifications() {
  const [isShow, setIsShow] = useState(false);
  const {notifications, nNotifications, markRead} = useContext(NotificationsContext);
  const {t} = useTranslation()

  useEffect(() => {
    if (nNotifications == 0 && isShow) {
      setIsShow(false)
    }
  }, [isShow, nNotifications]);

  return <>
    <Button variant={"outline-secondary"} onClick={() => setIsShow(!isShow)}
            disabled={!nNotifications}
            className={"fs-3 text-body p-2 border-0 pb-2"}>
      {nNotifications != undefined && nNotifications > 0 && (
        <div className={"fs-6"}>
          <Badge bg={"danger"} pill style={{position: "absolute", right: "4.4rem", top: "0.8rem"}}>
            {nNotifications > 99 ? ">99" : nNotifications}
          </Badge>
        </div>
      )}
      {isShow ? <BsBellFill/> : <BsBell/>}
    </Button>
    <NotificationCacheWrapper>
      <ToastContainer position={"top-end"} containerPosition={"absolute"}
                      className={"top-100 mt-3 me-3 z-1"}>
        {notifications?.map((notification) => (
          <Toast key={notification.id}
                 animation={true}
                 show={!notification.is_read && isShow}
                 onClose={() => markRead(notification.id)}
          >
            <ToastHeader closeButton={true}>
              <strong className={"me-auto"}>{t("Notification")}</strong>
              <small className={"text-muted"}>{moment(notification.createdAt).fromNow()}</small>
            </ToastHeader>
            <ToastBody>
              <div className={"fw-bold"}>
                <NotificationMessage message={notification.message}/>
              </div>
            </ToastBody>
          </Toast>
        ))
        }
      </ToastContainer>
    </NotificationCacheWrapper>
  </>
}
