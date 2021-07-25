import React, { useState } from "react";
import axios from "axios";
import "./LoginForm.css";
import { API_BASE_URL, ACCESS_TOKEN_NAME } from "../../constants/apiConstants";
import { withRouter } from "react-router-dom";

function LoginForm(props) {
  const [state, setState] = useState({
    username: "",
    password: "",
    successMessage: null,
  });
  const handleChange = (e) => {
    props.showError(null);
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    const payload = {
      username: state.username,
      password: state.password,
    };
    axios
      .post(API_BASE_URL + "/user/login", payload)
      .then(function (response) {
        if (response.status === 200) {
          setState((prevState) => ({
            ...prevState,
            successMessage: "Login successful. Redirecting to home page..",
          }));
          // console.log(state.username + "+" + response.data.token);
          localStorage.setItem(ACCESS_TOKEN_NAME, state.username + "&" + response.data.token);
          props.showError(null);
          redirectToHome();
        } else {
          props.showError("Incorrect username or password");
        }
      })
      .catch(function (error) {
        props.showError("Error logging in");
        console.log(error);
      });
  };
  const redirectToHome = () => {
    props.showError(null);
    props.updateTitle("Home");
    props.history.push("/home");
  };
  const redirectToRegister = () => {
    props.showError(null);
    props.history.push("/register");
    props.updateTitle("Register");
  };
  return (
    <div className="w3-card-4 card col-12 col-lg-4 login-card mt-2 hv-center">
      <form>
        <div className="form-group text-left">
          <label>User Name</label>
          <input type="username" className="form-control" id="username" aria-describedby="usernameHelp" placeholder="Enter User Name" value={state.username} onChange={handleChange} />
          <small id="usernameHelp" className="form-text text-muted">
            We'll never share your info with anyone else.
          </small>
        </div>
        <div className="form-group text-left">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input type="password" className="form-control" id="password" placeholder="Password" value={state.password} onChange={handleChange} />
        </div>
        <div className="form-check"></div>
        <button type="submit" className="btn btn-primary" onClick={handleSubmitClick}>
          Submit
        </button>
      </form>
      <div className="alert alert-success mt-2" style={{ display: state.successMessage ? "block" : "none" }} role="alert">
        {state.successMessage}
      </div>
      <div className="registerMessage">
        <span>Dont have an account? </span>
        <span className="loginText" onClick={() => redirectToRegister()}>
          Register
        </span>
      </div>
    </div>
  );
}

export default withRouter(LoginForm);
