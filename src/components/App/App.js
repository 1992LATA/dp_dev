import React, { Component } from 'react';
//import { Container } from 'semantic-ui-react';
import axios from 'axios';
import io from 'socket.io-client';
import Sidebar from '../App/sidebar';
import TableUser from '../TableUser/TableUser';
import ModalUser from '../ModalUser/ModalUser';
import'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

class App extends Component {
  constructor() {
    super();

    this.server = process.env.REACT_APP_API_URL || '';
    this.socket = io(this.server);

    this.state = {
      users: [],
      online: 0
    }

    this.fetchUsers = this.fetchUsers.bind(this);
    this.handleUserAdded = this.handleUserAdded.bind(this);
    this.handleUserUpdated = this.handleUserUpdated.bind(this);
    this.handleUserDeleted = this.handleUserDeleted.bind(this);
  }

  // Place socket.io code inside here
  componentDidMount() {
    this.fetchUsers();
    this.socket.on('visitor enters', data => this.setState({ online: data }));
    this.socket.on('visitor exits', data => this.setState({ online: data }));
    this.socket.on('add', data => this.handleUserAdded(data));
    this.socket.on('update', data => this.handleUserUpdated(data));
    this.socket.on('delete', data => this.handleUserDeleted(data));
  }

  // Fetch data from the back-end
  fetchUsers() {
    axios.get(`${this.server}/api/users/`)
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

    let i = users.findIndex(u => u._id === user._id)

    if (users.length > i) { users[i] = user }

    this.setState({ users: users });
  }

  handleUserDeleted(user) {
    let users = this.state.users.slice();
    users = users.filter(u => { return u._id !== user._id; });
    this.setState({ users: users });
  }

  render() {
    // let peopleOnline = this.state.online - 1;
    // let onlineText = "";

    // if (peopleOnline < 1) {
    //   onlineText = 'No one else is online';
    // } else {
    //   onlineText = peopleOnline > 1 ? `${this.state.online - 1} people are online` : `${this.state.online - 1} person is online`;
    // }

    return (
      <div>
        <div className='App'>
          <div className='App-header'>
            <h1 className='App-intro'>Document Management Service</h1>
          </div>
        </div>
       
        <BrowserRouter>
        <div className='d-flex'>
          <div className='col-auto'>
            <Sidebar />
          </div>
          <div>
            <Routes>
              {/* <Route path='/home' element={<Home />} /> */}
              <Route path='/process' element={<TableUser users={this.state.users} onUserUpdated={this.handleUserUpdated} onUserDeleted={this.handleUserDeleted} server={this.server} socket={this.socket} />} />
              <Route path='/users' element={<TableUser users={this.state.users} onUserUpdated={this.handleUserUpdated} onUserDeleted={this.handleUserDeleted} server={this.server} socket={this.socket} />} />
              <Route path='/new' element={<ModalUser headerTitle='Add New Process' buttonTriggerTitle='Add New Process' buttonSubmitTitle='Add' buttonColor='green' onUserAdded={this.handleUserAdded} server={this.server} socket={this.socket} />} />
              {/* <Route path='/edit/:id' element={<ModalUser headerTitle='Edit Process' buttonTriggerTitle='Edit' buttonSubmitTitle='Save' buttonColor='blue' onUserUpdated={this.handleUserUpdated} server={this.server} socket={this.socket} />} /> */}
            </Routes>
          </div>
    
        
        </div>
        </BrowserRouter>
      </div>
      
    );
  }
}

export default App;

// class Home extends Component {
//   render() {
//     return (
//       <div>
//         <h1>Home</h1>
//          <Container>
          
//          </Container>
//       </div>
     
//     );
//   }
// }