import {CEvent} from "../../dataclasses.ts";
import {Button, Form, InputGroup, Modal} from "react-bootstrap";
import {BsClipboard, BsClipboardCheckFill} from "react-icons/bs";
import {useState} from "react";

export default function ShareModal({event, show, setShow}: {
  event: CEvent,
  show: boolean,
  setShow: (show: boolean) => void,
}) {
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
      <Modal.Title>Share</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form.Label>Event ID</Form.Label>
      <InputGroup>
        <Form.Control
          type="text"
          aria-describedby="inputGroupPrepend"
          name={"id"}
          value={event.id}
          disabled={true}
        />
      </InputGroup>
    </Modal.Body>
    <Modal.Footer>
      <Button variant={"primary"} onClick={handleClick}
              className={"d-flex align-items-center gap-1"}>
        {!clicked ? (
          <>
            <BsClipboard/>&nbsp;Copy
          </>
        ) : (
          <>
            <BsClipboardCheckFill/>&nbsp;Copied
          </>
        )}
      </Button>
    </Modal.Footer>

  </Modal>
}