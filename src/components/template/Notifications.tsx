import {BsBell, BsBellFill} from "react-icons/bs";
import {Badge, Button, Toast, ToastBody, ToastContainer, ToastHeader} from "react-bootstrap";
import {ReactNode, useContext, useEffect, useState} from "react";
import {NotificationsContext} from "../../contexts/notificationsContext.tsx";
import {Link} from "react-router-dom";
import {make_front_url, UrlsFront} from "../../urls.ts";
import {NotificationCacheContext, NotificationCacheWrapper} from "./NotificationsCache.tsx";
import {getUserById} from "../../fetches.tsx";
import {Trans, useTranslation} from "react-i18next";
import {TFunction} from "i18next";


export default function Notifications() {
  const [isShow, setIsShow] = useState(false);
  const {notifications, nNotifications, markRead} = useContext(NotificationsContext);
  // const {t} = useTranslation()

  useEffect(() => {
    if (nNotifications == 0 && isShow) {
      setIsShow(false)
    }
  }, [isShow, notifications]);

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
                      className={"top-100 mt-3 me-3"}>
        {notifications?.map((notification) => (
          <Toast key={notification.id} animation={false} show={!notification.is_read && isShow}
                 onClose={() => markRead(notification.id)}>
            <ToastHeader closeButton={true}>
              <strong className={"me-auto"}>Notification</strong>
              <small className={"text-muted"}>{notification.createdAt.toISOString()}</small>
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

function NotificationMessage({message}: { message: string }) {
  const {t} = useTranslation()
  const elements = new Map<string, string>();
  const regex = /#(\w+)<([^>]+)>/g;
  let match;
  let formattedString = message;

  while ((match = regex.exec(message)) !== null) {
    const [fullMatch, className, id] = match;
    elements.set(className, id);
    const link = `#${className}<{}>`
    formattedString = formattedString.replace(fullMatch, link);
  }
  const FormatFunction = LinksMap.get(formattedString)
  if (!FormatFunction) {
    return message
  }
  const linker = new ElementsLinker(elements)
  return <FormatFunction linker={linker} t={t}/>;
}

const LinksMap: Map<string, ({linker, t}: {
  linker: ElementsLinker,
  t: TFunction
}) => ReactNode> = new Map([
  ["#User<{}> joined #Event<{}>", ({linker, t}) => <>
    <Trans
      t={t}
      i18nKey={"EVENT_JOINED"}
      components={{
        user: (
          <UserLink linker={linker}/>
        ),
        event: (
          <Link to={linker.eventUrl}/>
        )
      }}/>
  </>],
  ["#User<{}> left #Event<{}>", ({linker}) => <>
    <UserLink linker={linker}/> left <Link to={linker.eventUrl}>event</Link>
  </>],
  ["#User<{}> changed #Event<{}>", ({linker}) => <>
    <UserLink linker={linker}/> changed <Link to={linker.eventUrl}>event</Link>
  </>],
  ["#User<{}> deleted #Event<{}>", ({linker}) => <>
    <UserLink linker={linker}/> deleted <Link to={linker.eventUrl}>event</Link>
  </>],
  ["#User<{}> is new host of #Event<{}>", ({linker}) => <>
    <UserLink linker={linker}/> is new host of <Link to={linker.eventUrl}>event</Link>
  </>],

  ["#User<{}> created #Deposit<{}> of #Event<{}>", ({linker}) => <>
    <UserLink linker={linker}/> created <Link to={linker.depositUrl}>deposit</Link>
  </>],
  ["#User<{}> updated #Deposit<{}> of #Event<{}>", ({linker}) => <>
    <UserLink linker={linker}/> updated <Link to={linker.depositUrl}>deposit</Link>
  </>],
  ["#User<{}> deleted #Deposit<{}> of #Event<{}>", ({linker}) => <>
    <UserLink linker={linker}/> deleted <Link to={linker.depositUrl}>deposit</Link>
  </>],

  ["#User<{}> created #Repayment<{}> of #Event<{}>", ({linker}) => <>
    <UserLink linker={linker}/> created <Link to={linker.repaymentUrl}>repayment</Link>
  </>],
  ["#User<{}> updated #Repayment<{}> of #Event<{}>", ({linker}) => <>
    <UserLink linker={linker}/> updated <Link to={linker.repaymentUrl}>repayment</Link>
  </>],
  ["#User<{}> deleted #Repayment<{}> of #Event<{}>", ({linker}) => <>
    <UserLink linker={linker}/> deleted <Link to={linker.repaymentUrl}>repayment</Link>
  </>],
])


class ElementsLinker {
  public elements: Map<string, string>;

  constructor(elements: Map<string, string>) {
    this.elements = elements

  }

  public get userUrl() {
    return make_front_url(UrlsFront.USER_BY_ID, {id: this.elements.get("User")!})
  }

  public usernameUrl(username: string) {
    return make_front_url(UrlsFront.USER, {username})
  }

  public get userId() {
    return parseInt(this.elements.get("User")!)
  }

  public get eventUrl() {
    return make_front_url(UrlsFront.EVENT, {eventId: this.elements.get("Event")!})
  }

  public get depositUrl() {
    return make_front_url(UrlsFront.DEPOSIT, {
      eventId: this.elements.get("Event")!,
      depositId: this.elements.get("Deposit")!
    })
  }

  public get repaymentUrl() {
    return make_front_url(UrlsFront.REPAYMENT, {
      eventId: this.elements.get("Event")!,
      repaymentId: this.elements.get("Repayment")!
    })
  }
}

function UserLink({linker}: { linker: ElementsLinker }) {
  const [username, setUsername] = useState<string>();
  const {cache} = useContext(NotificationCacheContext)
  const userId = linker.userId
  const cachedUsernamePromise = cache.get(userId)
  if (cachedUsernamePromise) {
    cachedUsernamePromise.then(setUsername)
  } else {
    const promise = getUserById(userId).then(user => user.username)
    promise.then(setUsername)
    cache.set(userId, promise)
  }
  return <Link
    to={username ? linker.usernameUrl(username) : linker.userUrl}>@{username || `id/${userId}`}</Link>
}
