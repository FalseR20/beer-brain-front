import {useEffect, useState} from "react";
import {CDetailedEvent} from "../../dataclasses.ts";
import {useParams} from "react-router-dom";
import {redirectGuest, getDetailedEvent} from "../../fetches.tsx";
import {FetchError} from "../../errors.ts";

export function useDetailedEvent() {
  const [event, setEvent] = useState<CDetailedEvent>();
  const [is404, setIs404] = useState<boolean>(false)

  const params = useParams<{ eventId: string }>();
  useEffect(() => {
    getDetailedEvent(params.eventId!)
      .then(setEvent)
      .catch((error: FetchError) => {
        redirectGuest(error)
        setIs404(true)
      })
  }, [params.eventId, setEvent]);

  return {event, is404}
}