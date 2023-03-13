import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class HeaderNav extends Component {
  render() {
    return (
        <nav class="navbar bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">
                    <img src="icon.png"  alt="" width="50" height="50" class="d-inline-block align-text-top"/>MyAudioEmailr</a>
                <div/>
                <ul class="nav">

                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="/">Home Page</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="/signup">Sign Up</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="/signin">Sign In</a>
                    </li>
                </ul>
            </div>
        </nav>
    )
  }
}
