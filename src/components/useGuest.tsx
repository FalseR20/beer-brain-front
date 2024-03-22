import {useNavigate} from "react-router-dom";
import {UrlsFront} from "../urls.ts";
import {FetchError, TokenError} from "../errors.ts";

export default function useGuest() {
  const navigate = useNavigate();

  const redirectGuest = (reason?: FetchError) => {
    if (reason && !(reason instanceof TokenError)) {
      return
    }
    navigate(UrlsFront.GUEST)
  }

  return {redirectGuest}
}
