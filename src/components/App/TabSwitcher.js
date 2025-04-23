import React from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import BusinessProcess from '../BusinessProcess/BusinessProcess'
//import Documents from '../Documents/Documents'
import Docuement from '../Document/Document'
//import DocumentUpload from '../DocumentUpload/DocumentUpload';
import DocumentTypeService from '../DocumentTypeService/DocumentTypeService'
const TabSwitcher = () => {

  return (
    <Tabs>
      <TabList>
        <Tab>Business Process</Tab>
        <Tab>Documents</Tab>
       {/* // <Tab>DocumentUpload</Tab> */}
        { <Tab>DocumentTypeService</Tab> }
      </TabList>


      
      <TabPanel>
        <BusinessProcess />
      </TabPanel>


      <TabPanel>
        <Docuement />
      </TabPanel>
      
      {/* <TabPanel>
        <DocumentUpload />
      </TabPanel> */}

      { <TabPanel>
        <DocumentTypeService />
      </TabPanel> }



    </Tabs>
  );
};


export default TabSwitcher;
