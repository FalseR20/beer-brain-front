import {ReactNode} from "react";
import "../../css/Template.css";
import Header from "./Header.tsx";
import {Helmet} from "react-helmet-async";
import {useTranslation} from "react-i18next";
import Footer from "./Footer.tsx";

export interface TemplateProps {
  children?: ReactNode;
  noWrap?: boolean;
  title?: string;
}

export default function Template(props: TemplateProps) {
  const {i18n} = useTranslation();
  return (
    <>
      {props.title ? (
        <Helmet>
          <html lang={i18n.language}/>
          <title>{props.title}</title>
        </Helmet>
      ) : ""}

      <div className={"d-flex flex-column min-vh-100"}>
        <Header/>
        <div className={"d-flex flex-row justify-content-center flex-grow-1"}>
          {props.noWrap == true ? props.children : <>
            <div id={"common-field"} className={"m-3 width-60"}>
              {props.children}
            </div>
          </>}
        </div>
        <Footer/>
      </div>
    </>
  )
}
