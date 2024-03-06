import {ReactNode} from "react";
import "../css/Template.css";
import Header from "./header/Header.tsx";

export interface TemplateProps {
  children?: ReactNode;
  noWrap?: boolean;
}

export default function Template(props: TemplateProps) {
  return (
    <div className={"d-flex flex-column min-vh-100"}>
      <Header/>
      <div className={"d-flex flex-row justify-content-center flex-grow-1"}>
        {props.noWrap == true ? props.children : <>
          <div id={"common-field"} className={"m-3 width-60"}>
            {props.children}
          </div>
        </>}
      </div>
      <footer className="bg-body-tertiary border-top text-center text-white-50 p-2">
        &copy; FalseR / Bebra Bebrou
      </footer>
    </div>
  )
}
