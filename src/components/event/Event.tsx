import {useParams} from "react-router-dom";
import Template from "../Template.tsx";
import {useEffect, useState} from "react";
import NotFound from "../NotFound.tsx";
import "../../css/Event.css";
import {IDetailedEvent} from "../../interfaces.ts";
import {EventHeader} from "./EventHeader.tsx";
import {EventMembers} from "./EventMembers.tsx";
import {EventPayers} from "./EventPayers.tsx";
import {EventSettings} from "./EventSettings.tsx";
import {catchUnauthorized, FetchError, getDetailedEvent} from "../../fetches.tsx";

export default function Event() {
  const [event, setEvent] = useState<IDetailedEvent>();
  const [is404, setIs404] = useState<boolean>(false)

  const params = useParams();
  const event_id = params.event_id as string;
  useEffect(() => {
    getDetailedEvent(event_id)
      .then(setEvent)
      .catch(async (reason: FetchError) => {
        const error = await catchUnauthorized(reason)
        if (error.status == 404) {
          setIs404(true)
        }
      })
  }, [event_id]);


  if (event == undefined) {
    return is404 ? <NotFound/> : <Template/>;
  }
  return (<Template doAddWrapping={false}>
    <div id={"common-field"} className={"width-60"}>
      <EventHeader event={event}/>

      <div style={{display: "none"}}>
        <EventMembers event={event}/>
        <EventPayers event={event}/>
        <EventSettings/>
      </div>
    </div>
  </Template>);
}
