import {useEffect, useState} from "react";
import {CDetailedEvent} from "../../dataclasses.ts";
import {useParams} from "react-router-dom";
import {catchUnauthorized, FetchError, getDetailedEvent} from "../../fetches.tsx";

export function useDetailedEvent() {
  const [event, setEvent] = useState<CDetailedEvent>();
  const [is404, setIs404] = useState<boolean>(false)

  const params = useParams<{ eventId: string }>();
  useEffect(() => {
    getDetailedEvent(params.eventId!)
      .then(setEvent)
      .catch(async (reason: FetchError) => {
        const error = await catchUnauthorized(reason)
        if (error.status == 404) {
          setIs404(true)
        }
      })
  }, [params.eventId, setEvent]);

  return {event, is404}
}