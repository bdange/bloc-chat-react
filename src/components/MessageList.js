import React, { Component } from "react";

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      username: '',
      content: '',
      sentAt: '',
      roomId: ''
    };

    this.messagesRef = this.props.firebase.database().ref("messages");
    this.handleChange = this.handleChange.bind(this);
    this.createMessage = this.createMessage.bind(this);
  }


  componentDidMount(){
    this.messagesRef.on('child_added', snapshot => {
      const message = snapshot.val();
      message.key = snapshot.key;
      this.setState({messages: this.state.messages.concat(message)})
      });
    }


  createMessage() {
    this.messagesRef.push ({
      content: this.state.newMessage,
      roomId: this.props.activeRoom.key,
      sentAt: this.props.firebase.database.ServerValue.TIMESTAMP,
      username: this.props.username
    });
}

  handleSubmit(e){
    e.preventDefault();
    if (!this.state.newMessage){
      return;
    }
    this.createMessage(this.state.newMessage);
    this.setState({newMessage: ''});
  }

  handleChange(e){
    const newName =  e.target.value;
    this.setState({newMessage: newName});
  }

  render() {
    return (
      <div>
        <section className="messages">
          <p>{this.props.activeRoom.name}</p>
          <ul>
            {this.state.messages
              .filter(message => message.roomId === this.props.activeRoom.key)
              .map((message, index) => {
                return (
                  <li key={index}>
                    {new Date(message.sentAt).toString()}
                    {message.username}
                    {message.content}
                  </li>
                );
              })}
          </ul>
        </section>
        <section>
        <div className="create-message" >
          <form onSubmit={e => this.handleSubmit(e)}>
            <input
            type="text"
            value={this.state.newMessage}
            onChange={e=> this.handleChange(e)}
            className="newMessage"
            placeholder="Send a new message"
            />
            <input type="submit" value="send" />
         </form>
         </div>
         </section>
      </div>
    );
  };
}

export default MessageList;
