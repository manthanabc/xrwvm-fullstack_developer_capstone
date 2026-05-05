import React, { useState } from 'react';
import "./Register.css";
import Header from '../Header/Header';
import person_icon from "../assets/person.png";
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let register_url = window.location.origin + "/djangoapp/register";

  const register = async (e) => {
    e.preventDefault();
    if (!userName || !firstName || !lastName || !email || !password) {
      alert("All fields are required.");
      return;
    }

    const res = await fetch(register_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "userName": userName,
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "password": password
      }),
    });

    const json = await res.json();
    if (json.status === "Registered") {
      sessionStorage.setItem('username', userName);
      sessionStorage.setItem('firstname', firstName);
      sessionStorage.setItem('lastname', lastName);
      window.location.href = "/login";
    } else {
      alert(json.message || "Registration failed.");
    }
  };

  return (
    <div>
      <Header />
      <div className="register_container">
        <div className="header">Sign Up</div>
        <form className="inputs" onSubmit={register}>
          <div className="input">
            <img src={person_icon} className="img_icon" alt="Username" />
            <input type="text" name="username" placeholder="Username" className="input_field" onChange={(e) => setUserName(e.target.value)} />
          </div>
          <div className="input">
            <img src={person_icon} className="img_icon" alt="First Name" />
            <input type="text" name="firstname" placeholder="First Name" className="input_field" onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="input">
            <img src={person_icon} className="img_icon" alt="Last Name" />
            <input type="text" name="lastname" placeholder="Last Name" className="input_field" onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div className="input">
            <img src={email_icon} className="img_icon" alt="Email" />
            <input type="email" name="email" placeholder="Email" className="input_field" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input">
            <img src={password_icon} className="img_icon" alt="Password" />
            <input type="password" name="password" placeholder="Password" className="input_field" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="submit_panel">
            <button className="submit" type="submit">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
