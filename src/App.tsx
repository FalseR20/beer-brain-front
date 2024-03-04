import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path={UrlsFront.HOME} element={<Home/>}/>
        <Route path={UrlsFront.GUEST} element={<Guest/>}/>
        <Route path={UrlsFront.SIGN_IN} element={<SignIn/>}/>
        <Route path={UrlsFront.SIGN_UP} element={<SignUp/>}/>
        <Route path={UrlsFront.EVENT} element={<Event/>}/>
        <Route path={UrlsFront.EVENT_SETTINGS} element={<EventSettings/>}/>
        <Route path={UrlsFront.EVENT_MEMBER} element={<EventMember/>}/>
        <Route path={UrlsFront.USER_ME} element={<User me={true}/>}/>
        <Route path={UrlsFront.USER} element={<User/>}/>
        <Route path={"*"} element={<NotFound/>}/>
      </Routes>
    </Router>
  );
}

export default App;
