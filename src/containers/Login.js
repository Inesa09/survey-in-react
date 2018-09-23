import React, { Component } from 'react';
import fireDB from '../fireDB';
import SmallMessage from '../components/SmallMessage';

class Login extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.signup = this.signup.bind(this);
    this.state = {
      email: '',
      password: ''
    };
    this.error = '';
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  login(e) {
    e.preventDefault();
    fireDB.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
    }).catch((error) => {
        console.log(error);
      });
  }

  signup(e){
    e.preventDefault();
    fireDB.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
    }).then((u)=>{console.log(u)})
    .catch((error) => {
        console.log(error);
      })
  }
  render() {
    return (
      <div style={{backgroundColor: 'darkslateblue', height: '100vh', 
        display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div className='ui segment' 
        style={{width: '45%', boxShadow: '0px 2px 15px 5px rgba(34, 34, 34, 0.8)', padding: '20px'}}>
        <form className='ui form'>
          <div className='equal width fields'>
            <div className='field'>
              <div className='ui fluid input'>
                <input value={this.state.password} onChange={this.handleChange} type="password" name="password"
                  style={{textAlign: 'right'}} placeholder='Password' />
              </div>
            </div>
            <div className='field'>
              <div className='ui fluid input'>
                <input value={this.state.email} onChange={this.handleChange} type="email" name="email" 
                  style={{textAlign: 'right'}} placeholder='Email' maxlength='19' />
              </div>
            </div>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <button onClick={this.signup} className='ui blue basic button'
              style={{margin: '10px'}}> Sign up </button>
            <button type='submit' onClick={this.login} className='ui blue button'
              style={{margin: '10px'}}> Log in </button>
          </div>
        </form>

        <div className='ui icon info message'>
          <div className='content' style={{textAlign: 'right', marginRight: '25px'}}>
            <div className='header'> You are not able to submit forms without log in the system! </div>
            <p> Please log in or sign up, if you are not signed up yet. </p>
          </div>
          <i aria-hidden='true' className='sign in icon' />
        </div>

        <SmallMessage name='negative' id='error' text1='Invalid action!'
          text2={this.state.error} />

        {/* this.props.showEl('error', 250000000, false); */}
      </div>
      </div>
    );
  }
}
export default Login;