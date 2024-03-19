import {Col, Container, Image, Row} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import {lazy} from "react";

const Template = lazy(() => import("./template/Template.tsx"))


export default function About() {
  const {t} = useTranslation();
  return (
    <Template title="About">
      <Container fluid={true} className={"p-0"}>
        <Row className="align-items-center">
          <Col sm={5}>
            <Image src={"me_500x500.png"} alt={t("Me")} fluid={true} className={"rounded-3"}/>
          </Col>
          <Col sm={7}>
            <div className="border-bottom mb-2">
              <div className={"fw-bold"} style={{fontSize: "3rem"}}>
                @{t("Developer username")}
              </div>
              <div style={{fontSize: "2.5rem"}}>
                {t("Developer fullname")}
              </div>
            </div>
            <div>
              <p className={"fs-5"}>
                {t("Developer description")}
              </p>
              <p>
                <span>Email: </span>
                <Link to={`mailto: ${t("Developer email")}`}>{t("Developer email")}</Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </Template>
  )
}