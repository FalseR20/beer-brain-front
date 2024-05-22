import {Link} from "react-router-dom";
import {make_front_url, UrlsFront} from "../../urls.ts";
import {ReactNode, useContext, useState} from "react";
import {NotificationCacheContext} from "../../contexts/notificationsCache.tsx";
import {getUserById} from "../../fetches.tsx";
import {Trans, useTranslation} from "react-i18next";

interface ElementsProps {
  elements: Map<string, string>,
}

interface MessageProps extends ElementsProps {
  formattedString: string,
}

export function NotificationMessage({message}: { message: string }) {
  const elements = new Map<string, string>();
  const regex = /#([^<]+)<([^>]+)>/g;
  let match;
  let formattedString = message;

  while ((match = regex.exec(message)) !== null) {
    const [fullMatch, className, id] = match;
    elements.set(className, id);
    formattedString = formattedString.replace(fullMatch, className);
  }
  return <LinkedMessage elements={elements} formattedString={formattedString}/>;

}

function LinkedMessage({elements, formattedString}: MessageProps) {
  const {t} = useTranslation()
  const entriesMap = new Map()
  elements.forEach((_, key) => {
    entriesMap.set(key, TypeToLinkMap.get(key)!({elements}))
  })
  const components = Object.fromEntries(entriesMap.entries())
  return <Trans
    t={t}
    i18nKey={formattedString}
    components={components}/>
}

const TypeToLinkMap: Map<string, ({elements}: ElementsProps) => ReactNode> = new Map([
  ["User", UserLink],
  ["User1", User1Link],
  ["Event", EventLink],
  ["Deposit", DepositLink],
  ["Repayment", RepaymentLink],
])

function UserLink({elements}: ElementsProps) {
  return BaseUserLink({userId: parseInt(elements.get("User")!)})
}

function User1Link({elements}: ElementsProps) {
  return BaseUserLink({userId: parseInt(elements.get("User1")!)})
}

function BaseUserLink({userId}: { userId: number }) {
  const [username, setUsername] = useState<string>();
  const {cache} = useContext(NotificationCacheContext)
  const cachedUsernamePromise = cache.get(userId)
  if (cachedUsernamePromise) {
    cachedUsernamePromise.then(setUsername)
  } else {
    const promise = getUserById(userId).then(user => user.username)
    promise.then(setUsername)
    cache.set(userId, promise)
  }
  if (username) {
    return <Link to={make_front_url(UrlsFront.USER, {username})}>@{username}</Link>
  }
  return <Link to={make_front_url(UrlsFront.USER_BY_ID, {id: userId})}>{`id/${userId}`}</Link>
}

function EventLink({elements}: ElementsProps) {
  return <Link to={make_front_url(UrlsFront.EVENT, {eventId: elements.get("Event")!})}/>
}

function DepositLink({elements}: ElementsProps) {
  return <Link to={make_front_url(UrlsFront.DEPOSIT, {
    eventId: elements.get("Event")!,
    depositId: elements.get("Deposit")!
  })}/>
}

function RepaymentLink({elements}: ElementsProps) {
  return <Link to={make_front_url(UrlsFront.REPAYMENT, {
    eventId: elements.get("Event")!,
    repaymentId: elements.get("Repayment")!
  })}/>
}