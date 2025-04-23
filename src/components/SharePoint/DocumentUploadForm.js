import React, { Component } from 'react';
import { Table, Input, Button, Icon } from 'semantic-ui-react';
import axios from 'axios';
import ModalUser from '../ModalUser/ModalUser';
import ModalConfirmDelete from '../ModalConfirmDelete/ModalConfirmDelete';

class DocumentUploadForm extends Component {
  state = {
    users: [],
    filteredUsers: [],
    searchQuery: '',
  };

  componentDidMount() {
    this.fetchBusinessProcesses();
  }

  fetchBusinessProcesses = async () => {
    try {
      const response = await axios.get('http://nhtridevsrv.nht.gov.jm:8777/api/v1/GetAllBusinessProcesses');
      if (response.data && response.data.data) {
        const formattedUsers = response.data.data.map((process) => ({
          _id: process.processID,
          name: process.name,
          owner: process.processOwner,
          description: process.processDescription,
          status: process.isActive ? 'Active' : 'Inactive',
        }));
        this.setState({ users: formattedUsers, filteredUsers: formattedUsers });
      } else {
        console.error('Invalid data format received:', response.data);
      }
    } catch (error) {
      console.error('Error fetching business processes:', error);
    }
  };

  handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const filteredUsers = this.state.users.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.owner.toLowerCase().includes(query) ||
      user.description.toLowerCase().includes(query) ||
      user.status.toLowerCase().includes(query)
    );
    this.setState({ searchQuery: query, filteredUsers });
  };

  render() {
    const { filteredUsers, searchQuery } = this.state;

    return (
      <div>
        <Input
          icon={<Icon name='search' inverted circular link />}
          placeholder='Search...'
          value={searchQuery}
          onChange={this.handleSearch}
          style={{ marginBottom: '10px', width: '100%' }}
        />
        <Table singleLine sortable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Process</Table.HeaderCell>
              <Table.HeaderCell>Owner</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredUsers.map(user => (
              <Table.Row key={user._id}>
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell>{user.owner}</Table.Cell>
                <Table.Cell>{user.description}</Table.Cell>
                <Table.Cell>
                  <Button color={user.status === 'Active' ? 'green' : 'red'} size='small'>
                    {user.status}
                  </Button>
                </Table.Cell>
                <Table.Cell>
                  <ModalUser
                    headerTitle='Edit Process'
                    buttonTriggerTitle='Edit'
                    buttonSubmitTitle='Save'
                    buttonColor='blue'
                    userID={user._id}
                    onUserUpdated={this.fetchBusinessProcesses}
                    server={this.props.server}
                    socket={this.props.socket}
                  />
                  <ModalConfirmDelete
                    headerTitle='Delete User'
                    buttonTriggerTitle='Delete'
                    buttonColor='red'
                    user={user}
                    onUserDeleted={this.fetchBusinessProcesses}
                    server={this.props.server}
                    socket={this.props.socket}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default DocumentUploadForm;