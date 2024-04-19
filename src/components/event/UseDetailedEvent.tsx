import {useEffect, useState} from "react";
import {CDetailedEvent} from "../../dataclasses.ts";
import {useParams} from "react-router-dom";
import {getDetailedEvent} from "../../fetches.tsx";
import {FetchError} from "../../errors.ts";
import useGuest from "../useGuest.tsx";

export function useDetailedEvent() {
  const [event, setEvent] = useState<CDetailedEvent>();
  const [is404, setIs404] = useState<boolean>(false)
  const {redirectGuest} = useGuest()

  const params = useParams<{ eventId: string }>();
  useEffect(() => {
    getDetailedEvent(params.eventId!)
      .then(setEvent)
      .catch((error: FetchError) => {
        redirectGuest(error)
        setIs404(true)
      })
  }, [params.eventId, setEvent]);

  return {event, setEvent, is404}
}