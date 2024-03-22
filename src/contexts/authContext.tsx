import {createContext, ReactNode, useEffect, useState} from "react";
import {CUser} from "../dataclasses.ts";
import {getMyUser} from "../fetches.tsx";
import {isTokenExist} from "../tokens.ts";


export const AuthContext = createContext<{
  user: CUser | undefined | null,
  updateUser: () => void
}>(
  {
    user: undefined,
    updateUser: () => {
    }
  });

export function AuthContextWrapper(props: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<CUser | undefined | null>(undefined)
  const [isUserUpdated, setIsUserUpdated] = useState<boolean>(false)

  const updateUser = () => setIsUserUpdated(true)

  useEffect(() => {
    if (isTokenExist()) {
      getMyUser().then(setUser).catch(() => {
        setUser(null)  // invalid token
      })
    } else {
      setUser(null)  // guest
    }
    if (isUserUpdated) {
      setIsUserUpdated(false)
    }
  }, [isUserUpdated]);

  return (
    <AuthContext.Provider value={{user, updateUser}}>
      {props.children}
    </AuthContext.Provider>
  )
}
