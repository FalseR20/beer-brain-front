import {ReactNode} from "react";
import "../../css/Template.css";
import Header from "./Header.tsx";
import {Helmet} from "react-helmet-async";
import {Link} from "react-router-dom";
import {UrlsFront} from "../../urls.ts";
import {useTranslation} from "react-i18next";

export interface TemplateProps {
  children?: ReactNode;
  noWrap?: boolean;
  title?: string;
}

export default function Template(props: TemplateProps) {
  const {t} = useTranslation();
  return (
    <>
      {props.title ? (
        <Helmet>
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
        <footer className="bg-body-tertiary border-top text-center text-muted p-2">
          &copy;{" "}
          <Link to={UrlsFront.ABOUT} className={"text-reset"}>
            {t("Developer username")} / {t("Developer fullname")}
          </Link>
        </footer>
      </div>
    </>
  )
}
