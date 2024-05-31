import {Link} from "react-router-dom";
import {UrlsFront} from "../../urls.ts";
import {BsEnvelopeFill, BsGithub, BsTelegram} from "react-icons/bs";
import {useTranslation} from "react-i18next";
import {ReactNode} from "react";

export default function Footer() {
  const {t} = useTranslation();

  const linkIcons: { href: string, icon: ReactNode }[] = [
    {href: t("Github repo"), icon: <BsGithub/>},
    {href: t(`mailto: ${t("Developer email")}`), icon: <BsEnvelopeFill/>},
    {href: t(`https://t.me/${t("Developer telegram")}`), icon: <BsTelegram/>},
  ];

  return <footer className="bg-body-tertiary border-top text-center text-muted p-2">
    &copy;{" "}
    <Link to={UrlsFront.ABOUT} className={"text-reset"}>
      {t("Developer username")} / {t("Developer fullname")}
    </Link>
    {linkIcons.map((link, index) => (
      <a key={index} href={link.href}
         target="_blank"
         className={"ps-3 fs-4 text-muted hover-cursor-pointer"}>
        {link.icon}
      </a>
    ))}
  </footer>
}