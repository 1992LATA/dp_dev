import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Input, Modal, Form, Message } from 'semantic-ui-react';
import axios from 'axios';

const DocumentTable = () => {
  const [documents, setDocuments] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    documentID: '',
    name: '',
    description: '',
    documentTypeID: '',
    dateCreated: '',
    isActive: true
  });
  const [updateMessage, setUpdateMessage] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('http://nhtridevsrv.nht.gov.jm:8777/api/v1/GetAllDocuments');
      if (response.data?.data) {
        const formattedDocuments = response.data.data.map((doc) => ({
          ...doc,
          dateCreated: new Date(doc.dateCreated).toLocaleString()
        }));
        setDocuments(formattedDocuments);
      } else {
        console.error('Invalid data:', response.data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleEdit = (doc) => {
    setEditForm({
      documentID: doc.documentID,
      name: doc.name,
      description: doc.description,
      documentTypeID: doc.documentTypeID,
      dateCreated: new Date().toISOString(),
      isActive: true
    });
    setEditModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://nhtridevsrv.nht.gov.jm:8777/api/v1/UpdateDocument?id=${editForm.documentID}`,
        editForm
      );
      setUpdateMessage(response.data?.responseMessage || 'Updated successfully!');
      setTimeout(() => {
        setEditModalOpen(false);
        fetchDocuments();
        setUpdateMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error updating document:', error);
      setUpdateMessage('Failed to update. Please try again.');
    }
  };

  const handleDelete = async (documentID) => {
    const confirmed = window.confirm('Are you sure you want to delete this document?');
    if (!confirmed) return;

    try {
      // Replace with real DELETE endpoint if available
      console.log(`Would delete document ID: ${documentID}`);
      alert('Delete not yet implemented. Replace this with an actual API call.');
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const columns = [
    { name: 'Document Name', selector: row => row.name, sortable: true },
    { name: 'Description', selector: row => row.description, sortable: true },
    { name: 'Date Created', selector: row => row.dateCreated, sortable: true },
    { name: 'Document Type', selector: row => row.documentTypeName, sortable: true },
    {
      name: 'Actions',
      cell: (row) => (
        <>
          <Button color='blue' onClick={() => handleEdit(row)}>Edit</Button>
          <Button color='black' onClick={() => handleDelete(row.documentID)}>Delete</Button>
        </>
      )
    }
  ];

  const filteredDocs = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <Input
        icon='search'
        placeholder='Search documents...'
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: '20px', width: '300px' }}
      />

      <DataTable
        title='Documents'
        columns={columns}
        data={filteredDocs}
        pagination
        highlightOnHover
        striped
      />

      <Modal open={editModalOpen} size='tiny' onClose={() => setEditModalOpen(false)}>
        <Modal.Header>Edit Document</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              label='Document Name'
              name='name'
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
            <Form.TextArea
              label='Description'
              name='description'
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            />
            <Form.Input
              label='Document Type ID'
              name='documentTypeID'
              value={editForm.documentTypeID}
              onChange={(e) =>
                setEditForm({ ...editForm, documentTypeID: parseInt(e.target.value, 10) || '' })
              }
            />
          </Form>

          {updateMessage && (
            <Message
              success={updateMessage.toLowerCase().includes('success')}
              warning={!updateMessage.toLowerCase().includes('success')}
              content={updateMessage}
            />
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button color='green' onClick={handleUpdate}>Update</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default DocumentTable;
