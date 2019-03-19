import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase';
import RoomList from './components/RoomList';
import MessageList from './components/MessageList';
import User from './components/User';

var config = {
    apiKey: "AIzaSyCUFY-nU5V2kIXM7O4iiC5vA3rRbp4xlh0",
    authDomain: "bloc-chat-536ce.firebaseapp.com",
    databaseURL: "https://bloc-chat-536ce.firebaseio.com",
    projectId: "bloc-chat-536ce",
    storageBucket: "bloc-chat-536ce.appspot.com",
    messagingSenderId: "631834485694"
  };
  firebase.initializeApp(config);

var provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().signInWithPopup(provider).then(function(result) {
  var token = result.credential.accessToken;
  var user = result.user;
}).catch(function(error) {
  var errorCode = error.code;
  var errorMessage = error.message;
  var email = error.email;
  var credential = error.credential;
});

  class App extends Component {
    constructor(props) {
      super(props);
      this.state = {
        activeRoom: { key: 0, name: "" },
        user: '',
        rooms: {},
        selectedRoom: null,
        messages: {}
      };
    }
    render() {
      return (
        <div className="App">
          <RoomList
            firebase={firebase}
            setActiveRoom={function(newActiveRoom) {
              this.setState({ activeRoom: newActiveRoom });
            }.bind(this)}
          />
          <MessageList firebase={firebase} activeRoom={this.state.activeRoom} createMessage={this.createMessage} />
          <User firebase={firebase} user={this.state.user} setUser={function(user) {
            this.setState({ user: user});}.bind(this) }/>
        </div>
      );
    }
  }

  export default App;
