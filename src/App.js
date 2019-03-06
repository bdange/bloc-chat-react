import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from'firebase';
import RoomList from './components/RoomList';

var config = {
    apiKey: "AIzaSyCUFY-nU5V2kIXM7O4iiC5vA3rRbp4xlh0",
    authDomain: "bloc-chat-536ce.firebaseapp.com",
    databaseURL: "https://bloc-chat-536ce.firebaseio.com",
    projectId: "bloc-chat-536ce",
    storageBucket: "bloc-chat-536ce.appspot.com",
    messagingSenderId: "631834485694"
  };
  firebase.initializeApp(config);

class App extends Component {
  render() {
    return (
      <div className="App">
        <RoomList firebase={firebase}/>
      </div>
    );
  }
}

export default App;
