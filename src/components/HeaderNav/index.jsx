import React, { Component } from 'react'
import "./nav.css"
export default class HeaderNav extends Component {
  render() {
    return (
        <nav className="navbar bg-body-tertiary">   
            <div className="logo-container">
                <img src="icon.png" alt="" width="50" height="50" />
                <span>MyAudioEmailr</span>
            </div>
            <ul className="nav">
                <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="/">Home Page</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="/receiveMail">Dashboard</a>
                </li>
                {/* below two links guide user to the sign in and log in system for app, commented since we 
                    decided to not use it for dual account function
                <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="/signup">Sign Up App Account</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="/localsignin">Log in App Account</a>
                </li>
                */}
            </ul>
        </nav>
    )
  }
}
