import {BsBell, BsBellFill} from "react-icons/bs";
import {Badge, Button, ListGroup, Modal} from "react-bootstrap";
import {ReactNode, useContext, useState} from "react";
import {NotificationsContext} from "../../contexts/notificationsContext.tsx";
import {Link} from "react-router-dom";
import {make_front_url, UrlsFront} from "../../urls.ts";
import {getUserById} from "../../fetches.tsx";
import {CNotification} from "../../dataclasses.ts";

export default function Notifications() {
  const [isShow, setIsShow] = useState(false);
  const {notifications, markRead} = useContext(NotificationsContext);
  const [notificationsOpened, setNotificationsOpened] = useState<CNotification[]>([])
  const nNotifications = notifications?.length || 0;

  function openNotifications() {
    if (nNotifications > 0) {
      setNotificationsOpened(notifications!)
      setIsShow(true);
      markRead()
    }
  }

  function closeNotifications() {
    setIsShow(false);
  }

  return <>
    <Button variant={"outline-secondary"} onClick={openNotifications}
            className={"fs-3 text-body p-2 border-0 pb-2"}>
      {nNotifications > 0 && (
        <div className={"fs-6"}>
          <Badge bg={"danger"} pill style={{position: "absolute", right: "4.4rem", top: "0.8rem"}}>
            {nNotifications > 99 ? ">99" : nNotifications}
          </Badge>
        </div>
      )}
      {isShow ? <BsBellFill/> : <BsBell/>}
    </Button>
    <Modal animation={false} size={"lg"} centered={true} show={isShow} onHide={closeNotifications}>
      <Modal.Header closeButton>
        <Modal.Title>
          Notifications
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={"p-0"}>
        <ListGroup variant={"flush"}>
          {notificationsOpened.length > 0 ? notificationsOpened?.map((notification) => (
            <ListGroup.Item key={notification.id}>
              <div className={"fw-bold"}>
                {notificationMessage(notification.message)}
              </div>
              <div className={"text-end"}>
                {notification.createdAt.toISOString()}
              </div>
            </ListGroup.Item>
          )) : <>
          <ListGroup.Item>
            All read!
          </ListGroup.Item>
          </>}
        </ListGroup>
      </Modal.Body>
    </Modal>
  </>
}

function notificationMessage(message: string) {
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
  return <FormatFunction linker={linker}/>;
}

const LinksMap: Map<string, ({linker}: { linker: ElementsLinker }) => ReactNode> = new Map([
  ["#User<{}> joined #Event<{}>", ({linker}) => <>
    <UserLink linker={linker}/> joined <Link to={linker.eventUrl}>event</Link>
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
  const userId = linker.userId
  const cachedUsernamePromise = UsernamesCache.get(userId)
  if (cachedUsernamePromise) {
    cachedUsernamePromise.then(setUsername)
  } else {
    const promise = getUserById(userId).then(user => user.username)
    promise.then(setUsername)
    UsernamesCache.set(userId, promise)
  }
  return <Link to={username ? linker.usernameUrl(username) : linker.userUrl}>@{username || `id/${userId}`}</Link>
}

const UsernamesCache: Map<number, Promise<string>> = new Map([])
