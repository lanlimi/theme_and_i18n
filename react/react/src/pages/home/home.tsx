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
    const [showMenu, setShowMenu] = useState<string>('1');

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
                        // defaultSelectedKeys={['1']}
                        selectedKeys={[showMenu]}
                        mode="inline"
                        theme="dark"
                        inlineCollapsed={collapsed}
                        items={items}
                        onSelect={(item) => setShowMenu(item.key)}
                    />
                </Sider>
                {showMenu === '1' && <HomePage />}
                {showMenu === '2' && <div>日程管理</div>}
                {showMenu === '3' && <div>日程订阅</div>}
                {showMenu === '4' && <div>个性化配置</div>}
                {showMenu === '5' && <div>设置</div>}
            </Layout>
        </div>
    )
}

export default Home