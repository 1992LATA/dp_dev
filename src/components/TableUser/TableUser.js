import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import axios from 'axios';

import ModalUser from '../ModalUser/ModalUser';
import ModalConfirmDelete from '../ModalConfirmDelete/ModalConfirmDelete';
import ModalView from '../ModalView/ModalView';

class TableUser extends Component {
  state = {
    users: [],
    selectedUser: null,
    modalOpen: false,
    modalViewOpen: false,
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
          processOwner: process.processOwner,
          processDescription: process.processDescription,
          collectionName: process.collectionName || "N/A",
          status: process.isActive ? 'Active' : 'Inactive',
          dateCreated: process.dateCreated,
        }));

        this.setState({ users: formattedUsers });
      } else {
        console.error('Invalid data format received:', response.data);
      }
    } catch (error) {
      console.error('Error fetching business processes:', error);
    }
  };

  handleEditClick = (user) => {
    this.setState({ selectedUser: user, modalOpen: true });
  };

  handleViewClick = (user) => {
    this.setState({ selectedUser: user, modalViewOpen: true });
  };

  handleAddNewClick = () => {
    this.setState({ selectedUser: null, modalOpen: true });
  };

  handleModalClose = () => {
    this.setState({ modalOpen: false, selectedUser: null });
  };

  handleModalViewClose = () => {
    this.setState({ modalViewOpen: false, selectedUser: null });
  };

  render() {
    const { users, selectedUser, modalOpen, modalViewOpen } = this.state;
    const isEditing = !!selectedUser;

    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2>Business Processes</h2>
          <Button color="green" onClick={this.handleAddNewClick}>
            Add New Business Process
          </Button>
        </div>

        <Table singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Process</Table.HeaderCell>
              <Table.HeaderCell>Owner</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Collection</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users.map((user) => (
              <Table.Row key={user._id}>
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell>{user.processOwner}</Table.Cell>
                <Table.Cell>{user.processDescription}</Table.Cell>
                <Table.Cell>{user.collectionName}</Table.Cell>
                <Table.Cell>{user.status}</Table.Cell>
                <Table.Cell>
                  <Button color="blue" onClick={() => this.handleEditClick(user)}>Edit</Button>
                  <Button color="grey" onClick={() => this.handleViewClick(user)}>View</Button>
                  <ModalConfirmDelete
                    headerTitle="Delete Process"
                    buttonTriggerTitle="Delete"
                    buttonColor="black"
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

        {modalOpen && (
          <ModalUser
            headerTitle={isEditing ? "Edit Process" : "Add New Process"}
            buttonTriggerTitle={isEditing ? "Update Business Process" : "Add New Business Process"}
            buttonSubmitTitle={isEditing ? "Update" : "Save"}
            buttonColor={isEditing ? "blue" : "green"}
            userID={selectedUser?._id || null}
            userData={selectedUser || {}}
            open={modalOpen}
            onClose={this.handleModalClose}
            onUserUpdated={this.fetchBusinessProcesses}
            server={this.props.server}
            socket={this.props.socket}
          />
        )}

        {modalViewOpen && (
          <ModalView
            open={modalViewOpen}
            onClose={this.handleModalViewClose}
            userData={selectedUser}
          />
        )}
      </>
    );
  }
}

export default TableUser;
