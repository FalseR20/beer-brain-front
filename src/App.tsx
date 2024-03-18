import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./components/Home.tsx";
import SignIn from "./components/SignIn.tsx";
import SignUp from "./components/SignUp.tsx";
import Event from "./components/event/Event.tsx";
import NotFound from "./components/NotFound.tsx";
import Guest from "./components/Guest.tsx";
import "./css/App.scss";
import User from "./components/user/User.tsx";
import EventMember from "./components/event/EventMember.tsx";
import {UrlsFront} from "./urls.ts";
import {EventSettings} from "./components/event/EventSettings.tsx";
import ThemeContextWrapper from "./contexts/themeContext.tsx";
import {AuthContextWrapper} from "./contexts/authContext.tsx";
import {HelmetProvider} from "react-helmet-async";
import Deposit from "./components/event/Deposit.tsx";
import Repayment from "./components/event/Repayment.tsx";
import ChangePassword from "./components/user/ChangePassword.tsx";
import "./i18n/config.ts";
import About from "./components/About.tsx";

function Router() {
  return (
    <BrowserRouter>
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
        <Route path={UrlsFront.USER_ME} element={<User/>}/>
        <Route path={UrlsFront.USER} element={<User/>}/>
        <Route path={UrlsFront.CHANGE_PASSWORD} element={<ChangePassword/>}/>
        <Route path={UrlsFront.ABOUT} element={<About/>}/>
        <Route path={"*"} element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  const helmetContext = {};
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
