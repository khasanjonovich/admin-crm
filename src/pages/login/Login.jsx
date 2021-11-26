/* eslint-disable jsx-a11y/anchor-has-content */
import { useContext, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/auth/AuthContext";
import { login } from "../../context/auth/apiCalls";
import "./login.css";

const LoginPage = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const { isFetching, dispatch } = useContext(AuthContext);
  const history = useHistory();
  const location = useLocation();
  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await login({ username, password }, dispatch);
    if (res) {
      history.push(`${location.pathname}`);
    } else {
      history.push("/login");
    }
  };
  return (
    <div className="login">
      <div id="loginform">
        <h2 id="headerTitle">Login</h2>
        <div>
          <div className="row">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="row">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div id="button" className="row">
            <button onClick={handleLogin} disabled={isFetching}>
              Log in
            </button>
          </div>
        </div>
        <OtherMethods />
      </div>
    </div>
  );
};

export default LoginPage;

const OtherMethods = (props) => (
  <div id="alternativeLogin">
    <label>Or sign in with:</label>
    <div id="iconGroup">
      <a href="https://fb.com" id="facebookIcon" />
      <a href="https://twitter.com" id="twitterIcon" />
      <a href="https://google.com" id="googleIcon" />
    </div>
  </div>
);
