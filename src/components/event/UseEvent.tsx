import {useEffect, useState} from "react";
import {CEvent} from "../../dataclasses.ts";
import {useParams} from "react-router-dom";
import {getEvent, redirectGuest} from "../../fetches.tsx";
import {FetchError} from "../../errors.ts";

export function useEvent() {
  const [event, setEvent] = useState<CEvent>();
  const [is404, setIs404] = useState<boolean>(false)

  const params = useParams<{ eventId: string }>();
  useEffect(() => {
    getEvent(params.eventId!)
      .then(setEvent)
      .catch((error: FetchError) => {
        redirectGuest(error)
        setIs404(true)
      })
  }, [params.eventId, setEvent]);

  return {event, is404}
}