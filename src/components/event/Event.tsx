import {useParams} from "react-router-dom";
import Template from "../Template.tsx";
import {useEffect, useState} from "react";
import NotFound from "../NotFound.tsx";
import getAuthHeader from "../../authentication.ts";
import "../../css/Event.css";
import {make_url, UrlPatterns} from "../../constants.ts";
import {IDetailedEvent} from "../../interfaces.ts";
import {EventHeader} from "./EventHeader.tsx";
import {EventMembers} from "./EventMembers.tsx";
import {EventPayers} from "./EventPayers.tsx";
import {EventSettings} from "./EventSettings.tsx";

export default function Event() {
  const [event, setEvent] = useState<IDetailedEvent | undefined>(undefined);
  const params = useParams();
  const event_id = params.event_id;
  useEffect(() => {
    fetch(make_url(UrlPatterns.GET_DETAILED_EVENT, {eventId: event_id as string}), {
      headers: getAuthHeader(),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setEvent(data!);
      });
  }, [event_id]);

  if (event_id === undefined) {
    return <NotFound/>;
  } else if (event == undefined) {
    return <Template/>;
  } else {
    return <EventValidated event={event}/>;
  }
}

function EventValidated({event}: { event: IDetailedEvent }) {
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
