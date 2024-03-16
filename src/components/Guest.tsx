import Template from "./Template.tsx";
import {Trans, useTranslation} from "react-i18next";

export default function Guest() {
  const { t } = useTranslation();
  return (
    <Template title={t("Guest title")}>
      <div className={"d-flex flex-column align-items-center"}>
        <img
          alt={""}
          src={"BeerBrain-nobg.png"}
          style={{width: "20rem", height: "20rem"}}
        />
        <p className={"fs-1 p-1 text-center"}>
          <Trans t={t}>Guest description</Trans>
        </p>
      </div>
    </Template>
  );
}
