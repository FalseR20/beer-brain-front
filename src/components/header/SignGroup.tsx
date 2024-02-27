import {Button} from "react-bootstrap";
import {signOut} from "../../fetches.tsx";
import {UrlsFront} from "../../urls.ts";
import {useContext} from "react";
import {UserContext} from "../../contexts/userContext.tsx";

export function SignGroup() {
  const user = useContext(UserContext)
  return user != null ? (
    <Button
      variant={"outline-secondary"}
      onClick={() => {
        signOut().then(() => {
          window.location.replace("/");
        })
      }}
    >
      Sign Out
    </Button>
  ) : (
    <div className={"d-flex gap-3"}>
      <Button variant={"outline-success"} href={UrlsFront.SIGN_IN}>
        Sign In
      </Button>
      <Button variant={"success"} href={UrlsFront.SIGN_UP}>
        Sign Up
      </Button>
    </div>
  );
}
