import React, { Component } from "react";
import axios from "axios";
import 'smart-webcomponents-react/source/styles/smart.default.css';
import io from "socket.io-client";
import TabSwitcher from "./TabSwitcher";
import Navbar from '../App/Navbar/Navbar';
import "./App.css";

class App extends Component {
  constructor() {
    super();

    this.server = process.env.REACT_APP_API_URL || "http://localhost:8777";
    this.socket = this.server ? io(this.server) : null;

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
    
    if (this.socket) {
      this.socket.on("visitor enters", (data) => this.setState({ online: data }));
      this.socket.on("visitor exits", (data) => this.setState({ online: data }));
      this.socket.on("add", (data) => this.handleUserAdded(data));
      this.socket.on("update", (data) => this.handleUserUpdated(data));
      this.socket.on("delete", (data) => this.handleUserDeleted(data));
    }
  }

  fetchUsers() {
    axios
      .get(`${this.server}/api/users/`)
      .then((response) => {
        this.setState({ users: response.data });
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
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
    return (
      <div>
        <Navbar />
        <br />
        <TabSwitcher />
      </div>
    );
  }
}

export default App;
