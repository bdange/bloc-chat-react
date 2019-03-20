import React, { Component } from "react";

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      newMessage: ""
    };

    this.messagesRef = this.props.firebase.database().ref("messages");
    this.handleChange = this.handleChange.bind(this);
    this.createMessage = this.createMessage.bind(this);
  }


  componentDidMount(){
    this.messagesRef.on('child_added', snapshot => {
      const message = snapshot.val();
      const key = snapshot.key;
      this.setState({messages: this.state.messages.concat(message)})
      });
    }


  handleChange(e){
    const newMessage = e.target.value;
    this.setState({newMessage: newMessage});
  }

  createMessage() {
    this.messagesRef.push ({
      content: this.state.newMessage,
      roomId: this.props.activeRoom.key,
      sentAt: this.props.firebase.database.ServerValue.TIMESTAMP,
      username: this.props.user
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
        {this.props.user !== null &&
          <form id="create-message" onSubmit={(e) => this.handleSubmit(e)}>
            <input
            type="text"
            value={this.state.newMessage}
            onChange={(e) => this.handleChange(e)}
            name="newMessage"
            placeholder="Send a new message"
            />
            <input type="submit" value="send" />
         </form>
       }
         </section>
      </div>
    );
  };
}

export default MessageList;
