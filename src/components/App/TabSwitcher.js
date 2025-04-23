import React from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import BusinessProcess from '../BusinessProcess/BusinessProcess'
import Documents from "../Documents/Documents";
import UserManagement from "../UserManagement/UserManagement ";
import SharePoint from "../SharePoint/SharePoint";




const TabSwitcher = () => {

  return (
    <Tabs>
      <TabList>
        <Tab>Business Process</Tab>
        <Tab>Documents</Tab>
        <Tab>Collections</Tab>
        <Tab>Document Upload</Tab>
      </TabList>
      <TabPanel>
        <BusinessProcess />
      </TabPanel>

      <TabPanel>
        <Documents />
      </TabPanel>

      <TabPanel>
        <UserManagement />
      </TabPanel>

      <TabPanel>
        <SharePoint />
      </TabPanel>
    </Tabs>
  );
};


export default TabSwitcher;
