import Template from "../Template.tsx";
import {useEffect, useState} from "react";
import {IDetailedUser} from "../../interfaces.ts";
import {useParams} from "react-router-dom";
import {catchUnauthorized, FetchError, getDetailedUser} from "../../fetches.tsx";
import NotFound from "../NotFound.tsx";

export default function EventAction() {
  const [detailedUser, setDetailedUser] = useState<IDetailedUser>()
  const [is404, setIs404] = useState<boolean>(false)

  const params = useParams<{ eventId: string, username: string }>();
  useEffect(() => {
    getDetailedUser(params.eventId!, params.username!)
      .then(setDetailedUser)
      .catch(async (reason: FetchError) => {
        const error = await catchUnauthorized(reason)
        if (error.status == 404) {
          setIs404(true)
        }
      })
  }, [params]);

  if (detailedUser == undefined) {
    return is404 ? <NotFound/> : <Template/>;
  }
  return <Template>
    {detailedUser.balance}
  </Template>
}