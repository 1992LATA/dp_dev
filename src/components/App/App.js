
import React, { Component } from "react";
import axios from "axios";
import io from "socket.io-client";
import TabSwitcher from "./TabSwitcher";
import "./App.css";

class App extends Component {
  constructor() {
    super();

    this.server = process.env.REACT_APP_API_URL || "";
    this.socket = io(this.server);

    this.state = {
      users: [],
      online: 0,
    };

    this.fetchUsers = this.fetchUsers.bind(this);
    this.handleUserAdded = this.handleUserAdded.bind(this);
    this.handleUserUpdated = this.handleUserUpdated.bind(this);
    this.handleUserDeleted = this.handleUserDeleted.bind(this);
  }

  componentDidMount() {
    this.fetchUsers();
    this.socket.on("visitor enters", (data) => this.setState({ online: data }));
    this.socket.on("visitor exits", (data) => this.setState({ online: data }));
    this.socket.on("add", (data) => this.handleUserAdded(data));
    this.socket.on("update", (data) => this.handleUserUpdated(data));
    this.socket.on("delete", (data) => this.handleUserDeleted(data));
  }

  fetchUsers() {
    axios
      .get(`${this.server}/api/users/`)
      .then((response) => {
        this.setState({ users: response.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleUserAdded(user) {
    let users = this.state.users.slice();
    users.push(user);
    this.setState({ users: users });
  }

  handleUserUpdated(user) {
    let users = this.state.users.slice();
    let i = users.findIndex((u) => u._id === user._id);

    if (users.length > i) {
      users[i] = user;
    }

    this.setState({ users: users });
  }

  handleUserDeleted(user) {
    let users = this.state.users.slice();
    users = users.filter((u) => {
      return u._id !== user._id;
    });
    this.setState({ users: users });
  }

  render() {
    // let peopleOnline = this.state.online - 1;
    // let onlineText = peopleOnline < 1 
    //   ? "No one else is online" 
    //   : `${peopleOnline} ${peopleOnline > 1 ? "people are" : "person is"} online`;

    return (
      <div>
        <div className="App">
          <div className="App-header">
            <h1 className="App-intro">Business Process</h1>
            <p>
              Configure your business process here.
              <br />
              Add, update, or delete a process.
            </p>
          </div>
        </div>

        {/* Removed <Container> wrapper */}
        
        <TabSwitcher />
        
        
        
        {/* <em id="online">{onlineText}</em> */}


        
        <br />
      </div>
    );
  }
}

export default App;
