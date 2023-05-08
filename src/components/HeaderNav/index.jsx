import React, { Component } from 'react'
//import "./nav.css"
export default class HeaderNav extends Component {
  render() {
    return (
        <nav class="navbar bg-body-tertiary" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>   
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src="icon.png" alt="" width="50" height="50" />
                <span style={{ marginLeft: '8px' }}>MyAudioEmailr</span>
            </div>
                <ul class="nav">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="/">Main Entrance</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="/signup">Sign Up App Account</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="/localsignin">Log in Prototype</a>
                    </li>
                </ul>
        </nav>
    )
  }
}
