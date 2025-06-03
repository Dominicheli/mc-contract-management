import { Button, Drawer, Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { MenuOutlined } from "@ant-design/icons";
import logo from "../assets/logo.png";

const { Header } = Layout;

const routes = [
  { path: "/fornecedores", label: "Fornecedores" },
  { path: "/tipo-de-ativo", label: "Tipo de Ativo" },
  { path: "/ativo", label: "Ativo" },
  { path: "/contrato-de-venda", label: "Contrato de Venda" },
];

export default function AppHeader() {
  const location = useLocation();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const selectedKey =
    routes.find((route) => location.pathname.startsWith(route.path))?.path ||
    "";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 16px",
      }}
    >
      <Link to="/">
        <img
          src={logo}
          alt="Meu Cliente"
          style={{ height: 40, objectFit: "contain", display: "flex" }}
        />
      </Link>

      {isMobile ? (
        <>
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: 24, color: "#fff" }} />}
            onClick={() => setDrawerVisible(true)}
          />
          <Drawer
            title={
              <img
                src={logo}
                alt="Meu Cliente"
                style={{ height: 40, objectFit: "contain", display: "flex" }}
              />
            }
            placement="right"
            onClose={() => setDrawerVisible(false)}
            visible={drawerVisible}
          >
            <Menu
              mode="vertical"
              selectedKeys={[selectedKey]}
              onClick={() => setDrawerVisible(false)}
            >
              {routes.map((route) => (
                <Menu.Item key={route.path}>
                  <Link to={route.path}>{route.label}</Link>
                </Menu.Item>
              ))}
            </Menu>
          </Drawer>
        </>
      ) : (
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          style={{
            flex: 1,
            marginLeft: 20,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {routes.map((route) => (
            <Menu.Item key={route.path}>
              <Link to={route.path}>{route.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      )}
    </Header>
  );
}
