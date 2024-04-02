import {CEvent} from "../../dataclasses.ts";
import {Button, Form, FormGroup, InputGroup, Modal} from "react-bootstrap";
import {BsClipboard, BsClipboardCheckFill} from "react-icons/bs";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {make_front_url, UrlsFront} from "../../urls.ts";

export default function ShareModal({event, show, setShow}: {
  event: CEvent,
  show: boolean,
  setShow: (show: boolean) => void,
}) {
  const {t} = useTranslation();
  const [clickedId, setClickedId] = useState(false);
  const [clickedLink, setClickedLink] = useState(false);
  const handleClose = () => setShow(false);

  const link = location.origin + make_front_url(UrlsFront.INVITE, {eventId: event.id})

  return <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>{t("Share title")}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <FormGroup controlId="eventId">
        <Form.Label>{t("Event id")}</Form.Label>
        <InputGroup>
          <Form.Control
            type="text"
            name={"id"}
            value={event.id}
            disabled={true}
          />
          <Button variant={"secondary"}
                  onClick={() => navigator.clipboard.writeText(event.id).then(() => {
                    setClickedId(true);
                    setTimeout(() => setClickedId(false), 1200)
                  })}
                  className={"d-flex align-items-center gap-1"}>
            {!clickedId ? (
              <>
                <BsClipboard/>
              </>
            ) : (
              <>
                <BsClipboardCheckFill/>
              </>
            )}
          </Button>
        </InputGroup>
        <hr/>
        <Form.Label>{t("Invite link")}</Form.Label>
        <InputGroup>
          <Form.Control
            type="text"
            name={"id"}
            value={link}
            disabled={true}
          />
          <Button variant={"secondary"}
                  onClick={() => navigator.clipboard.writeText(link).then(() => {
                    setClickedLink(true);
                    setTimeout(() => setClickedLink(false), 1200)
                  })}
                  className={"d-flex align-items-center gap-1"}>
            {!clickedLink ? (
              <>
                <BsClipboard/>
              </>
            ) : (
              <>
                <BsClipboardCheckFill/>
              </>
            )}
          </Button>
        </InputGroup>
      </FormGroup>

    </Modal.Body>

  </Modal>
}