import HomePage from "./components/homePage/homePage";
import useStyles from "./style/index";
import React, { useState } from 'react';
import { ContainerOutlined, DesktopOutlined, PieChartOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Flex, Layout, Menu, Segmented, theme, type MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { Content, Footer, Header } from 'antd/es/layout/layout';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    { key: '1', icon: <PieChartOutlined />, label: '主页' },
    { key: '2', icon: <DesktopOutlined />, label: '日程管理' },
    { key: '3', icon: <ContainerOutlined />, label: '日程订阅' },
    { key: '4', icon: <ContainerOutlined />, label: '个性化配置' },
    { key: '5', icon: <ContainerOutlined />, label: '设置' },
];

const Home = () => {
    const { styles } = useStyles();
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className={styles.root}>
            
            <Layout style={{
                width: '100%',
                height: '100%',
            }}>
                <Sider style={{ width: '20%' }}>
                    <Header style={{ background: '#696969', height: 64, padding: 12 }}>
                        
                    </Header>
                    <Menu
                        defaultSelectedKeys={['1']}
                        mode="inline"
                        theme="dark"
                        inlineCollapsed={collapsed}
                        items={items}
                    />
                </Sider>
                <HomePage />
            </Layout>
        </div>
    )
}

export default Home