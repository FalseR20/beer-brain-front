import {ReactNode} from "react";
import "../css/Template.css";
import Header from "./header/Header.tsx";

export interface TemplateProps {
  children?: ReactNode;
  // checkAuthorization?: boolean;
  doAddWrapping?: boolean;
}

export default function Template(props: TemplateProps) {
  // if (props.checkAuthorization == true && !isAuthorized()) {
  //   window.location.href = "/guest"
  // }
  return (
    <div className={"d-flex flex-column min-vh-100"}>
      <Header/>
      <div className={"d-flex flex-row justify-content-center flex-grow-1"}>
        {props.doAddWrapping == false ? props.children : <>
          <div id={"common-field"} className={"width-60 m-3"}>
            {props.children}
          </div>
        </>}
      </div>
      <footer className="bg-body-tertiary border-top text-center text-white-50 p-2">
        &copy; FalseR / Bebra Bebrou
      </footer>
    </div>
  );
}
