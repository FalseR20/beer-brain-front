import {CDeposit, CEvent, CRepayment, CUser} from "../../dataclasses.ts";
import {Link} from "react-router-dom";
import {BsArrowLeftCircle, BsArrowRightCircle, BsPlusCircle} from "react-icons/bs";
import {UserAvatar} from "../user/UserAvatar.tsx";
import {BALANCE_FORMAT, BANK_FORMAT} from "../../constants.ts";
import {ListGroup, ListGroupItemProps} from "react-bootstrap";
import {useTranslation} from "react-i18next";

export interface ActionItemProps extends ListGroupItemProps {
  action_: CDeposit | CRepayment
  event: CEvent
  user: CUser
  hideRightUser?: boolean
}

export default function ActionItem(props: ActionItemProps) {
  const {t} = useTranslation();
  const {action_: action, event, user} = props;
  const avatarSize = "2.8rem"
  let userDiff = 0.0
  if (action instanceof CDeposit) {
    userDiff = -action.value / event.users.length
    if (user.equals(action.user)) {
      userDiff += action.value
    }
  } else if (user.equals(action.payer)) {
    userDiff = action.value
  } else if (user.equals(action.recipient)) {
    userDiff = -action.value
  }
  return <ListGroup.Item as={Link}
                         action={true}
                         className={"d-flex flex-row align-items-center gap-3"}
                         to={action.makeFrontHref()}
                         {...props}>
    <div className={"d-flex align-items-center gap-2"}>
      {action instanceof CDeposit ? <>
        <div style={{width: avatarSize, height: avatarSize}}
             className={"d-none d-sm-block"}/>
        <BsPlusCircle size={"1.8rem"}/>
        <UserAvatar user={action.user} round={true} size={avatarSize}
                    className={`d-none ${props.hideRightUser ? "" : "d-sm-block"}`}/>
      </> : (action.payer.equals(user) ? <>
          <UserAvatar user={action.recipient} round={true} size={avatarSize}
                      className={"d-none d-sm-block"}/>
          <BsArrowLeftCircle size={"1.8rem"}/>
          <UserAvatar user={action.payer} round={true} size={avatarSize}
                      className={`d-none ${props.hideRightUser ? "" : "d-sm-block"}`}/>
        </> : <>
          <UserAvatar user={action.payer} round={true} size={avatarSize}
                      className={"d-none d-sm-block"}/>
          <BsArrowRightCircle size={"1.8rem"}/>
          <UserAvatar user={action.recipient} round={true} size={avatarSize}
                      className={`d-none ${props.hideRightUser ? "" : "d-sm-block"}`}/>
        </>
      )}
    </div>

    <div className={"d-flex flex-column flex-grow-1"}>
      <span>{action.description ? action.description : <i>{t("Unnamed")}</i>}</span>
      {/*<span>{action.payedAt.toLocaleString()}</span>*/}
      {userDiff != 0.0 ? <div>
        <span className={"text-muted"}>{t("Difference: ")}</span>
        <span className={userDiff < 0 ? "text-danger" : "text-success"}>
            {BALANCE_FORMAT.format(userDiff)}
          </span>
      </div> : <></>}
    </div>

    <h4 className={`m-0`}>
      {BANK_FORMAT.format(action.value)}
    </h4>
  </ListGroup.Item>
}