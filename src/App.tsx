import {BrowserRouter, Route, Routes} from "react-router-dom";
import {lazy, Suspense} from "react";
import Guest from "./components/Guest.tsx";
import "./css/App.scss";
import {UrlsFront} from "./urls.ts";
import ThemeContextWrapper from "./contexts/themeContext.tsx";
import {AuthContextWrapper} from "./contexts/authContext.tsx";
import {HelmetProvider} from "react-helmet-async";
import "./i18n/config.ts";
import About from "./components/About.tsx";
import {useTranslation} from "react-i18next";
import moment from "moment/moment";

const NotFound = lazy(() => import("./components/NotFound.tsx"))
const Home = lazy(() => import("./components/Home.tsx"))
const SignIn = lazy(() => import("./components/SignIn.tsx"))
const SignUp = lazy(() => import("./components/SignUp.tsx"))
const Event = lazy(() => import("./components/event/Event.tsx"))
const User = lazy(() => import("./components/user/User.tsx"))
const EventMember = lazy(() => import("./components/event/EventMember.tsx"))
const EventSettings = lazy(() => import("./components/event/settings/EventSettings.tsx"))
const Deposit = lazy(() => import("./components/event/Deposit.tsx"))
const Repayment = lazy(() => import("./components/event/Repayment.tsx"))
const Invite = lazy(() => import("./components/Invite.tsx"))
const ChangePassword = lazy(() => import("./components/user/ChangePassword.tsx"))
const Template = lazy(() => import("./components/template/Template.tsx"))


function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Template/>}>
        <Routes>
          <Route path={UrlsFront.HOME} element={<Home/>}/>
          <Route path={UrlsFront.GUEST} element={<Guest/>}/>
          <Route path={UrlsFront.SIGN_IN} element={<SignIn/>}/>
          <Route path={UrlsFront.SIGN_UP} element={<SignUp/>}/>
          <Route path={UrlsFront.EVENT} element={<Event/>}/>
          <Route path={UrlsFront.EVENT_SETTINGS} element={<EventSettings/>}/>
          <Route path={UrlsFront.EVENT_MEMBER} element={<EventMember/>}/>
          <Route path={UrlsFront.DEPOSIT} element={<Deposit/>}/>
          <Route path={UrlsFront.REPAYMENT} element={<Repayment/>}/>
          <Route path={UrlsFront.INVITE} element={<Invite/>}/>
          <Route path={UrlsFront.USER_ME} element={<User/>}/>
          <Route path={UrlsFront.USER} element={<User/>}/>
          <Route path={UrlsFront.CHANGE_PASSWORD} element={<ChangePassword/>}/>
          <Route path={UrlsFront.ABOUT} element={<About/>}/>
          <Route path={"*"} element={<NotFound/>}/>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default function App() {
  const helmetContext = {};
  const {i18n} = useTranslation();
  moment.locale(i18n.language);
  return (
    <HelmetProvider context={helmetContext}>
      <ThemeContextWrapper>
        <AuthContextWrapper>
          <Router/>
        </AuthContextWrapper>
      </ThemeContextWrapper>
    </HelmetProvider>
  )
}
