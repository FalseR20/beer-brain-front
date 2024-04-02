import {useNavigate, useParams} from "react-router-dom";
import {joinEvent} from "../fetches.tsx";
import {make_front_url, UrlsFront} from "../urls.ts";
import useGuest from "./useGuest.tsx";
import {FetchError} from "../errors.ts";
import Template from "./template/Template.tsx";
import {useEffect} from "react";

export default function Invite() {
  const navigate = useNavigate();
  const {redirectGuest} = useGuest()
  const params = useParams<{ eventId: string }>();

  useEffect(() => {
    joinEvent(params.eventId!).then(() => {
      navigate(make_front_url(UrlsFront.EVENT, {"eventId": params.eventId!}))
    }).catch((error: FetchError) => {
      redirectGuest(error)
    })
  }, [navigate, params.eventId]);

  return <Template/>
}
