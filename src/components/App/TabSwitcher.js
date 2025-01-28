import React, { useState } from "react";
import BusinessProcesse from "../BusinessProcesse/BusinessProcesse";

const TabSwitcher = () => {
  // Define tabs and their corresponding components
  const tabs = [
    { name: "BusinessProcesse", component: <BusinessProcesse /> },
    { name: "Documents", component: <Documents /> },
    { name: "User Management", component: <UserManagement /> },
    { name: "SharePoint", component: <SharePoint /> },
  ];

  // State to track the currently active tab
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  return (
    <div>
      {/* Tab Navigation */}
      <div style={styles.tabContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.name}
            style={{
              ...styles.tabButton,
              backgroundColor: tab.name === activeTab ? "#007bff" : "#f1f1f1",
              color: tab.name === activeTab ? "#fff" : "#000",
            }}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Render the content of the active tab */}
      <div style={styles.tabContent}>
        {tabs.find((tab) => tab.name === activeTab)?.component}
      </div>
    </div>
  );
};

// Placeholder components for each tab
const BusinessProcesses = () => (
  <div>
    <h2>Business Processes</h2>
    <p>Here you can manage business processes.</p>
  </div>
);

const Documents = () => (
  <div>
    <h2>Documents</h2>
    <p>Here you can manage document services.</p>
  </div>
);

const UserManagement = () => (
  <div>
    <h2>User Management</h2>
    <p>Here you can manage users and permissions.</p>
  </div>
);

const SharePoint = () => (
  <div>
    <h2>SharePoint</h2>
    <p>Here you can manage SharePoint integrations.</p>
  </div>
);

// Inline styles
const styles = {
  tabContainer: {
    display: "flex",
    justifyContent: "space-around",
    borderBottom: "2px solid #ccc",
    marginBottom: "20px",
  },
  tabButton: {
    padding: "10px 20px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
  tabContent: {
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
};

export default TabSwitcher;
