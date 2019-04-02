import React, { Component } from "react";

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      username: "",
      content: "",
      sentAt: "",
      roomId: ""
    };

    this.messagesRef = this.props.firebase.database().ref("messages");
    this.handleChange = this.handleChange.bind(this);
    this.createMessage = this.createMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
  }

  componentDidMount() {
    this.messagesRef.on("child_added", snapshot => {
      const message = snapshot.val();
      message.key = snapshot.key;
      this.setState({ messages: this.state.messages.concat(message) });
    });
    this.messagesRef.on("child_removed", snapshot => {
      const message = snapshot.val();
      message.key = snapshot.key;
      let messages = this.state.messages.filter(msg => msg.key !== message.key);
      this.setState({ messages: messages });
    });
  }

  createMessage() {
    this.messagesRef.push({
      content: this.state.newMessage,
      roomId: this.props.activeRoom.key,
      sentAt: this.props.firebase.database.ServerValue.TIMESTAMP,
      username: this.props.username
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.newMessage) {
      return;
    }
    this.createMessage(this.state.newMessage);
    this.setState({ newMessage: "" });
  }

  handleChange(e) {
    const newName = e.target.value;
    this.setState({ newMessage: newName });
  }

  deleteMessage(message) {
    const deleteMessageRef = this.messagesRef.child(message.key);
    deleteMessageRef.remove();
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
                    <button
                      className="delete"
                      onClick={() => this.deleteMessage(message)}
                    >
                      delete
                    </button>
                  </li>
                );
              })}
          </ul>
        </section>
        <section>
          <div className="create-message">
            <form onSubmit={e => this.handleSubmit(e)}>
              <input
                type="text"
                value={this.state.newMessage}
                onChange={e => this.handleChange(e)}
                className="newMessage"
                placeholder="Send a new message"
              />
              <input type="submit" value="send" />
            </form>
          </div>
        </section>
      </div>
    );
  }
}

export default MessageList;
