import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Mailbox from "../pages/MailBox/components/App.js";
import VAPP from "../pages/MailBox/containers/vmailbox.jsx";
import configureStore from "../store/configureStore.js";
import SignUpPage from "../pages/SignUp/SignUpPage";
import SignInPage from "../pages/SignIn/SignInPage";
import HeaderNav from "../components/HeaderNav";
import FlashMessageList from "../components/Flash/FlashMessageList";
import { Provider } from "react-redux";

const mailboxStore = configureStore(); //thunk middleware

const AppRoutes = () => {
  const location = useLocation();

  return (
    <div>
      {location.pathname !== "/receiveMail" && <HeaderNav />}
      <FlashMessageList />
      <Routes>
        <Route
          path="/receiveMail"
          element={
            <Provider store={mailboxStore}>
              <VAPP />
            </Provider>
          }
        ></Route>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<SignInPage />} />
      </Routes>
      </div>
  );
};

const index = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default index;
