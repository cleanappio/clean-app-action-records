

/*import React, { useState } from "react";
import { Layout, Menu, Image } from "antd";
import ActionTable from "./ActionTable";
import './App.css';
import logo from './assets/logo.png';

const { Header, Content, Sider } = Layout;

const App = () => {
  const [selectedMenuKey, setSelectedMenuKey] = useState("actions");

  const handleMenuClick = ({ key }) => {
    setSelectedMenuKey(key);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#fff", padding: 0, textAlign: "center" }}>
        <Image
          src = {logo}
          //alt="Logo"
          preview={false}
          height={64}
          style={{ margin: "16px auto" }}
        />
      </Header>
      <Layout>
        <Sider theme="light">
          <Menu
            mode="inline"
            selectedKeys={[selectedMenuKey]}
            onClick={handleMenuClick}
          >
            <Menu.Item key="actions">Actions</Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ margin: "16px" }}>
            {selectedMenuKey === "actions" && <ActionTable />}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
*/

/* import React, { useState } from "react";
import { Layout, Menu, Image, Switch, ConfigProvider, theme } from "antd";
import ActionTable from "./ActionTable";
import './App.css';
import logo from './assets/logo.png';

const { Content, Sider, Header } = Layout;

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeChange = (checked) => {
    setIsDarkMode(checked);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Layout>
          <Sider
            theme={isDarkMode ? "dark" : "light"}
            style={{ textAlign: "center", padding: "16px 0" }}
          >
            <Image
              src={logo} // Replace with the actual path to your logo
              alt="Logo"
              preview={false}
              height={64}
              style={{ marginBottom: "16px" }}
            />
            <Menu
              mode="inline"
              theme={isDarkMode ? "dark" : "light"}
              selectedKeys={["actions"]}
            >
              <Menu.Item key="actions">Actions</Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header
              style={{
                background: isDarkMode ? "#1f1f1f" : "#fff",
                padding: "0 16px",
                textAlign: "right",
              }}
            >
              <Switch
                checked={isDarkMode}
                onChange={handleThemeChange}
                checkedChildren="Dark"
                unCheckedChildren="Light"
              />
            </Header>
            <Content
              style={{
                margin: "16px",
                padding: "16px",
                background: isDarkMode ? "#141414" : "#fff",
              }}
            >
              <ActionTable />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
*/
/*
import React, { useState } from "react";
import { Layout, Menu, Image, Switch, ConfigProvider, theme } from "antd";
import ActionTable from "./ActionTable";
import './App.css';
import logo from './assets/logo.png';

const { Content, Sider, Header } = Layout;

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("actions");

  const handleThemeChange = (checked) => {
    setIsDarkMode(checked);
  };

  const handleMenuItemClick = (e) => {
    setSelectedMenuItem(e.key);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Layout>
          <Sider
            theme={isDarkMode ? "dark" : "light"}
            style={{ textAlign: "center", padding: "16px 0" }}
          >
            <Image
              src={logo} // Replace with the actual path to your logo
              alt="Logo"
              preview={false}
              height={64}
              style={{ marginBottom: "16px" }}
            />
            <Menu
              mode="inline"
              theme={isDarkMode ? "dark" : "light"}
              selectedKeys={[selectedMenuItem]}
              onClick={handleMenuItemClick}
            >
              <Menu.Item key="actions">Actions</Menu.Item>
              <Menu.Item key="mapview">Map View</Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header
              style={{
                background: isDarkMode ? "#1f1f1f" : "#fff",
                padding: "0 16px",
                textAlign: "right",
              }}
            >
              <Switch
                checked={isDarkMode}
                onChange={handleThemeChange}
                checkedChildren="Dark"
                unCheckedChildren="Light"
              />
            </Header>
            <Content
              style={{
                margin: "16px",
                padding: "16px",
                background: isDarkMode ? "#141414" : "#fff",
              }}
            >
              {selectedMenuItem === "actions" ? (
                <ActionTable />
              ) : selectedMenuItem === "mapview" ? (
                <ActionTable showMap={true} />
              ) : null}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
*/

import React, { useState } from "react";
import { Layout, Menu, Switch, ConfigProvider, theme } from "antd";
import ActionTable from "./ActionTable"; // Import ActionTable component
import MapView from "./MapView"; // Import MapView component
import './App.css';
import logo from './assets/logo.png';

const { Content, Sider, Header } = Layout;

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("actions");

  const handleThemeChange = (checked) => {
    setIsDarkMode(checked);
  };

  const handleMenuClick = (e) => {
    setSelectedMenu(e.key); // Switch between 'actions' and 'mapView'
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Layout>
          <Sider
            theme={isDarkMode ? "dark" : "light"}
            style={{ textAlign: "center", padding: "16px 0" }}
          >
            <img
              src={logo}
              alt="Logo"
              height={64}
              style={{ marginBottom: "16px" }}
            />
            <Menu
              mode="inline"
              theme={isDarkMode ? "dark" : "light"}
              selectedKeys={[selectedMenu]}
              onClick={handleMenuClick} // Handle menu item selection
            >
              <Menu.Item key="actions">Actions</Menu.Item>
              <Menu.Item key="mapView">Map View</Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header
              style={{
                background: isDarkMode ? "#1f1f1f" : "#fff",
                padding: "0 16px",
                textAlign: "right",
              }}
            >
              <Switch
                checked={isDarkMode}
                onChange={handleThemeChange}
                checkedChildren="Dark"
                unCheckedChildren="Light"
              />
            </Header>
            <Content
              style={{
                margin: "16px",
                padding: "16px",
                background: isDarkMode ? "#141414" : "#fff",
              }}
            >
              {/* Render ActionTable or MapView based on selected menu item */}
              {selectedMenu === "actions" ? <ActionTable /> : <MapView />}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
