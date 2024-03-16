import {CEvent} from "../../dataclasses.ts";
import {Button, Form, FormGroup, InputGroup, Modal} from "react-bootstrap";
import {BsClipboard, BsClipboardCheckFill} from "react-icons/bs";
import {useState} from "react";
import {useTranslation} from "react-i18next";

export default function ShareModal({event, show, setShow}: {
  event: CEvent,
  show: boolean,
  setShow: (show: boolean) => void,
}) {
  const {t} = useTranslation();
  const [clicked, setClicked] = useState(false);
  const handleClose = () => setShow(false);

  function handleClick() {
    navigator.clipboard.writeText(event.id).then(() => {
      setClicked(true);
      setTimeout(() => setClicked(false), 1200)
    })
  }

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
        </InputGroup>
      </FormGroup>
    </Modal.Body>
    <Modal.Footer>
      <Button variant={"primary"} onClick={handleClick}
              className={"d-flex align-items-center gap-1"}>
        {!clicked ? (
          <>
            <BsClipboard/>&nbsp;{t("Copy")}
          </>
        ) : (
          <>
            <BsClipboardCheckFill/>&nbsp;{t("Copied")}
          </>
        )}
      </Button>
    </Modal.Footer>

  </Modal>
}