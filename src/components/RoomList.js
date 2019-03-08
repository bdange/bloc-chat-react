import React, { Component } from 'react';

class RoomList extends Component {
  constructor(props){
    super(props);

this.state = {
  rooms: [],
  name: '',
  newRoomName: ''
};

this.roomsRef = this.props.firebase.database().ref("rooms");
this.handleChange = this.handleChange.bind(this);
this.createRoom = this.createRoom.bind(this);


}

componentDidMount() {
    this.roomsRef.on("child_added", snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState({ rooms: this.state.rooms.concat(room) });
    });
  }

handleChange(e){
  const newName = e.target.value;
  this.setState({newRoomName: newName});
}

createRoom(e){
  e.preventDefault();
  if (!this.state.newRoomName) { return }
  const newRoom = this.state.name;
  this.roomsRef.push({ name: this.state.newRoomName});
  this.setState ({ newRoomName: ''});
}

render() {
  return(
<div>
 <section>
 {
   this.state.rooms.map( (room, index) =>
     <li key={index}>{room.name}</li>
   )}
 </section>
 <section>
 {this.props.user !== null &&
   <form id="create-room" onSubmit={(e) => this.createRoom(e)}>
     <input
     type="text"
     value={this.state.newRoomName}
     onChange={(e) => this.handleChange(e)}
     name="newRoomName"
     placeholder="Create a new room"
     />
     <input type="submit" value="+" />
  </form>
}
  </section>
</div>
  );
}
}

export default RoomList;
