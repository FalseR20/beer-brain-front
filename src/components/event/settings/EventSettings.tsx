import {Alert, Button, ListGroup, OverlayTrigger, Tooltip} from "react-bootstrap";
import {make_front_url, UrlsFront} from "../../../urls.ts";
import {useDetailedEvent} from "../UseDetailedEvent.tsx";
import {lazy, useContext, useState} from "react";
import {AuthContext} from "../../../contexts/authContext.tsx";
import {Trans, useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import {ChangeEventForm} from "./ChangeEventForm.tsx";
import {LeaveEventModal} from "./LeaveEventModal.tsx";
import {DeleteEventModal} from "./DeleteEventModal.tsx";
import {TransferHostModal} from "./TransferHostModal.tsx";

const NotFound = lazy(() => import("../../NotFound.tsx"))
const Template = lazy(() => import("../../template/Template.tsx"))

export default function EventSettings() {
  const {t} = useTranslation();
  const leaveEventState = useState(false);
  const transferHostState = useState(false);
  const deleteEventState = useState(false);
  const {event, setEvent, is404} = useDetailedEvent()
  const {user} = useContext(AuthContext)

  if (event == undefined) {
    return is404 ? <NotFound/> : <Template/>;
  }
  const isHost: boolean | undefined = user?.equals(event.host)

  return (
    <Template title={t("Settings title", {name: event.name})}>
      <Alert show={isHost == false} variant={"warning"}>
        <Alert.Heading>{t("Settings rights warning")}</Alert.Heading>
        <Trans t={t}
               i18nKey="Settings rights"
               components={{
                 host: (
                   <Alert.Link as={Link}
                               to={make_front_url(UrlsFront.USER, {username: event.host.username})}
                   />
                 )
               }}/>

      </Alert>
      <h3 className={"border-bottom color-border-muted pb-1 mb-3"}>
        {t("Settings")}
      </h3>
      <ChangeEventForm event={event} isHost={isHost == true}/>

      <h3 className={"border-bottom color-border-muted pb-1 my-3"}>
        {t("Danger Zone")}
      </h3>
      <ListGroup className={"border border-danger rounded-2"} variant={"flush"}>
        <ListGroup.Item className={"d-flex flex-row align-items-center"}>
          <span className={"flex-grow-1"}>{t("Leave event description")}</span>
          {isHost ? (
            <OverlayTrigger
              placement="left"
              overlay={<Tooltip>{t("Leave event host")}</Tooltip>}
            >
            <span className="d-inline-block">
            <Button variant={"danger"} className={"my-2"} disabled={true}
                    style={{pointerEvents: 'none'}}>
              Leave
            </Button>
            </span>
            </OverlayTrigger>
          ) : (
            <Button variant={"danger"} className={"my-2"} disabled={isHost}
                    onClick={() => leaveEventState[1](true)}>
              {t("Leave event")}
            </Button>
          )}
        </ListGroup.Item>

        <ListGroup.Item className={"d-flex flex-row justify-content-between align-items-center"}>
          <span className={"flex-grow-1"}>
            {t("Transfer host rights")}
          </span>
          <Button variant={"danger"} className={"my-2"} disabled={!isHost}
                  onClick={() => transferHostState[1](true)}>
            {t("Transfer host")}
          </Button>
        </ListGroup.Item>

        <ListGroup.Item className={"d-flex flex-row justify-content-between align-items-center"}>
          <span className={"flex-grow-1"}>
            {t("Delete event description")}
          </span>
          <Button variant={"danger"} className={"my-2"} disabled={!isHost}
                  onClick={() => deleteEventState[1](true)}>
            {t("Delete event")}
          </Button>
        </ListGroup.Item>
      </ListGroup>
      <LeaveEventModal event={event} state={leaveEventState}/>
      <TransferHostModal event={event} setEvent={setEvent} state={transferHostState}/>
      <DeleteEventModal event={event} state={deleteEventState}/>
    </Template>
  )
}
