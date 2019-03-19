import React, { Component } from "react";

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      messages: [],
    };
    this.messageRef = this.props.firebase.database().ref("messages");
    this.handleChange = this.handleChange.bind(this);
    this.createMessage = this.createMessage.bind(this);
  }


  componentDidMount(){
    this.messageRef.on('child_added', snapshot => {
      const message = snapshot.val();
      const key = snapshot.key;
      if(message.roomId === this.state.selectedRoom){
        this.setState({messages: {...this.state.messages, [key]: message}
        })};
      });
    }


  handleChange(e){
    const newMessage = e.target.value;
    this.setState({newMessage: newMessage});
  }

  createMessage(e) {
    e.preventDefault();
    const message = {
      content: this.state.content,
      roomId: this.props.roomId,
      sentAt: this.props.firebase.database.ServerValue.TIMESTAMP,
      username: this.props.user
    }
    this.props.messageRef.push(message);
    this.setState({ content: ''});
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
                    {message.roomId}
                  </li>
                );
              })}
          </ul>
        </section>
        <section>
        {this.props.user !== null &&
          <form id="create-message" onSubmit={(e) => this.createMessage(e)}>
            <input
            type="text"
            value={this.state.newMessage}
            onChange={(e) => this.setState({newMessage: e.target.value})}
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
