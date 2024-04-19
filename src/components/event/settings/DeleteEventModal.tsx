import {CDetailedEvent} from "../../../dataclasses.ts";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {deleteEvent} from "../../../fetches.tsx";
import {UrlsFront} from "../../../urls.ts";
import {Button, Modal} from "react-bootstrap";
import {Dispatch, SetStateAction} from "react";

export function DeleteEventModal({event, state}: {
  event: CDetailedEvent,
  state: [boolean, Dispatch<SetStateAction<boolean>>]
}) {
  const navigate = useNavigate()
  const {t} = useTranslation();
  const [show, setShow] = state

  function handleDelete() {
    deleteEvent(event.id).then(() => {
      navigate(UrlsFront.HOME);
    })
  }

  return (
    <Modal show={show} onHide={() => setShow(false)} contentClassName={"border-danger"}>
      <Modal.Header closeButton>
        <Modal.Title>
          {t("Delete event description")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{t("Delete event warning")}</Modal.Body>
      <Modal.Footer className={"gap-2"}>
        <Button variant={"outline-secondary"} onClick={() => setShow(false)}>{t("Cancel")}</Button>
        <Button variant={"danger"} onClick={handleDelete}>{t("Delete event")}</Button>
      </Modal.Footer>
    </Modal>
  )
}