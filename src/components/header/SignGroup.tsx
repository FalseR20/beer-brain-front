import {isAuthorized} from "../../tokens.ts";
import {Button} from "react-bootstrap";
import {signOut} from "../../fetches.tsx";
import {UrlsFront} from "../../urls.ts";

export function SignGroup() {
  return isAuthorized() ? (
    <Button
      variant={"outline-secondary"}
      className={"me-3"}
      onClick={() => {
        signOut().then(() => {
          window.location.replace("/");
        })
      }}
    >
      Sign Out
    </Button>
  ) : (
    <>
      <Button variant={"outline-success"} className={"me-3"} href={UrlsFront.SIGN_IN}>
        Sign In
      </Button>
      <Button variant={"success"} className={"me-3"} href={UrlsFront.SIGN_UP}>
        Sign Up
      </Button>
    </>
  );
}