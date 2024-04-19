import {CDetailedEvent} from "../../../dataclasses.ts";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {leaveEvent} from "../../../fetches.tsx";
import {UrlsFront} from "../../../urls.ts";
import {Button, Modal} from "react-bootstrap";
import {Dispatch, SetStateAction} from "react";

export function LeaveEventModal({event, state}: {
  event: CDetailedEvent,
  state: [boolean, Dispatch<SetStateAction<boolean>>]
}) {
  const navigate = useNavigate()
  const {t} = useTranslation();
  const [show, setShow] = state

  function handleLeave() {
    leaveEvent(event.id).then(() => {
      navigate(UrlsFront.HOME)
    })
  }

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          {t("Leave event description")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{t("Leave event warning")}</Modal.Body>
      <Modal.Footer className={"gap-2"}>
        <Button variant={"outline-secondary"} onClick={() => setShow(false)}>{t("Cancel")}</Button>
        <Button variant={"danger"} onClick={handleLeave}>{t("Leave event")}</Button>
      </Modal.Footer>
    </Modal>
  )
}