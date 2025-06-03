import AppHeader from '../components/AppHeader';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

const AppLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Content style={{ padding: 24 }}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default AppLayout;
