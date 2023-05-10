//log in as app user
import React, { Component } from 'react'
import LocalsigninForm from "./LocalsigninForm"
import {connect} from "react-redux"
import * as authActions from "../../actions/auth"
import * as flashActions from "../../actions/flash"
import { bindActionCreators } from "redux"
class SignInPage extends Component {
    render() {
      return (
        <div className="row no-margin-padding">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <LocalsigninForm
              flashActions={this.props.flashActions}
              authActions={this.props.authActions}
            />
          </div>
          <div className="col-md-3"></div>
        </div>
      );
    }
  }
  

const mapDispatchToProps = dispatch =>{
    return{
        authActions:bindActionCreators(authActions,dispatch),
        flashActions:bindActionCreators(flashActions,dispatch)
    }
}

export default connect(null,mapDispatchToProps)(SignInPage)