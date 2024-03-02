import {createContext, ReactNode, useEffect, useState} from "react";
import {CUser} from "../dataclasses.ts";
import {getMyUser} from "../fetches.tsx";
import {isTokenExist} from "../tokens.ts";


export const UserContext = createContext<CUser | undefined | null>(undefined);

export function UserProvider(props: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<CUser | undefined | null>(undefined)
  useEffect(() => {
    if (isTokenExist()) {
      getMyUser().then(setUser).catch(() => {
        setUser(null)  // invalid token
      })
    } else {
      setUser(null)  // guest
    }
  }, []);

  return (
    <UserContext.Provider value={user}>
      {props.children}
    </UserContext.Provider>
  )
}