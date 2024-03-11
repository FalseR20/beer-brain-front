import Template from "../Template.tsx";
import {useParams} from "react-router-dom";
import {updateDeposit} from "../../fetches.tsx";
import NotFound from "../NotFound.tsx";
import {Button, Card, Form, InputGroup} from "react-bootstrap";
import {BsArrowLeft} from "react-icons/bs";
import {UserAvatar} from "../user/UserAvatar.tsx";
import {useEvent} from "./UseEvent.tsx";
import UrlPattern from "url-pattern";
import {UrlsFront} from "../../urls.ts";
import {BANK_FORMAT} from "../../constants.ts";
import * as yup from "yup";
import {Formik} from "formik";
import {useContext} from "react";
import {AuthContext} from "../../contexts/authContext.tsx";
import moment from "moment";

export default function Deposit() {
  // const {deposit, is404} = useDeposit()
  const user = useContext(AuthContext)
  const {event, is404} = useEvent()
  const params = useParams()
  if (!event) {
    return is404 ? <NotFound/> : <Template/>;
  }
  const deposit = event.deposits.find(value => value.id == params.depositId!)
  if (!deposit) {
    return <NotFound/>
  }
  const isUser = user?.equals(deposit.user) || false  //  || user?.equals(event.host)

  return (
    <Template title={deposit.description}>
      <div className={"d-flex flex-column gap-3"}>
        {/* Event member header */}
        <Card>
          <Card.Body className={"d-flex align-items-center px-3 py-2 gap-3"}>
            <Button variant={"outline-secondary border-0"}
                    href={new UrlPattern(UrlsFront.EVENT).stringify({eventId: event.id})}>
              <BsArrowLeft size={"2rem"}/>
            </Button>
            <div
              className={"d-flex flex-row gap-2 justify-content-between align-items-center w-50 border-end pe-3"}>
              <UserAvatar user={deposit.user} round={true} size={"3rem"}/>
              <div className={"d-flex flex-column justify-content-between flex-grow-1"}>
                    <span className={"fs-5"}>
                      {deposit.description}
                    </span>
                <span className={"fs-6 text-muted"}>
                      {deposit.payedAt.toLocaleString()}
                    </span>
              </div>
              <span className={"fs-3"}>
                    {BANK_FORMAT.format(deposit.value)}
                  </span>
            </div>
            <div>
              <Card.Title>
                {event.name}
              </Card.Title>
              <Card.Subtitle className={"text-muted text-end"}>
                {event.description}
              </Card.Subtitle>
            </div>
          </Card.Body>
        </Card>

        <h3>General</h3>
        <Formik
          validationSchema={yup.object().shape({
            value: yup.number().positive().required(),
            description: yup.string(),
          })}
          onSubmit={(values) => {
            updateDeposit(values, event, deposit).then(() => {
              window.location.reload();
            })
          }}
          initialValues={{
            value: deposit.value,
            description: deposit.description,
            payedAt: moment(deposit.payedAt).format('YYYY-MM-DD[T]HH:mm'),
          }}
        >
          {({handleSubmit, handleChange, handleReset, values, errors}) => (
            <Form noValidate onSubmit={handleSubmit} className={"d-flex flex-column gap-3 w-50"}>
              <Form.Group controlId="validationFormikValue">
                <Form.Label>Value</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="number"
                    step="0.01"
                    placeholder="7.62"
                    inputMode={"numeric"}
                    aria-describedby="inputGroupPrepend"
                    name="value"
                    value={values.value}
                    onChange={handleChange}
                    isInvalid={!!errors.value}
                    disabled={!isUser}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.value}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="validationFormikDescription">
                <Form.Label>Description</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    placeholder="Beer and crisps"
                    aria-describedby="inputGroupPrepend"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    isInvalid={!!errors.description}
                    disabled={!isUser}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="validationFormikDescription">
                <Form.Label>Datetime</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="datetime-local"
                    aria-describedby="inputGroupPrepend"
                    name="payedAt"
                    value={values.payedAt}
                    onChange={handleChange}
                    isInvalid={!!errors.payedAt}
                    disabled={true}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.payedAt}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <div className={"d-flex flex-row gap-3"}>
                <Button variant={"outline-secondary"} onClick={handleReset} disabled={!isUser}>Reset</Button>
                <Button variant="primary" type="submit" disabled={!isUser}>Update deposit</Button>
              </div>
            </Form>
          )}
        </Formik>

      </div>
    </Template>
  )
}

// function useDeposit() {
//   const [deposit, setDeposit] = useState<CDeposit>()
//   const [is404, setIs404] = useState<boolean>(false)
//
//
//   const params = useParams<{ eventId: string, depositId: string }>();
//   useEffect(() => {
//     getDeposit(params.eventId!, params.depositId!)
//       .then(setDeposit)
//       .catch((error: FetchError) => {
//         redirectGuest(error)
//         setIs404(true)
//       })
//   }, [params.depositId, params.eventId]);
//   return {deposit, is404}
// }