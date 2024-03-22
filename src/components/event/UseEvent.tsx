import {useEffect, useState} from "react";
import {CEvent} from "../../dataclasses.ts";
import {useParams} from "react-router-dom";
import {getEvent} from "../../fetches.tsx";
import {FetchError} from "../../errors.ts";
import useGuest from "../useGuest.tsx";

export function useEvent() {
  const [event, setEvent] = useState<CEvent>();
  const [is404, setIs404] = useState<boolean>(false)
  const {redirectGuest} = useGuest()

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