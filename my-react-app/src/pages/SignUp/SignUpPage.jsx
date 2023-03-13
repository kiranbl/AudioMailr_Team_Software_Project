import React, { Component } from 'react'

export default class SignUpPage extends Component {
  render() {
    return (


        <><form class="px-4 py-3">
        <div class="mb-3">
          <label for="exampleDropdownFormEmail1" class="form-label">Email address</label>
          <input type="email" class="form-control" id="exampleDropdownFormEmail1" placeholder="email@example.com" />
        </div>
        <div class="mb-3">
          <label for="exampleDropdownFormPassword1" class="form-label">Password</label>
          <input type="password" class="form-control" id="exampleDropdownFormPassword1" placeholder="Password" />
        </div>
        <div class="mb-3">
          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="dropdownCheck" />
            <label class="form-check-label" for="dropdownCheck">
              Remember me
            </label>
          </div>
        </div>
        <button type="submit" class="btn btn-primary">Sign in</button>
      </form>
        <label for="exampleDropdownFormEmail1" class="form-label">Already have an account?</label>
        <ul class="nav"><a class="nav-link active" aria-current="page" href="/signin">Sign in here</a></ul></>
    
    )
  }
}
