import HomePage from "./components/homePage/homePage";
import useStyles from "./style/index";
import React, { useState } from 'react';
import { ContainerOutlined, DesktopOutlined, PieChartOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Flex, Layout, Menu, Segmented, theme, type MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import ScheduleManage from "./components/schedule/Schedule.tsx";
import ScheduleSubscribe from "./components/subscribe/scheduleSubscribe.tsx"
import Setting from "./components/setting/setting.tsx";

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    { key: '1', icon: <PieChartOutlined />, label: '主页' },
    { key: '2', icon: <DesktopOutlined />, label: '日程管理' },
    { key: '3', icon: <ContainerOutlined />, label: '日程订阅' },
    // { key: '4', icon: <ContainerOutlined />, label: '个性化配置' },
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
            
            <Layout className='LayoutStyle'>
                <Sider className="siderStyle">
                    <div className="titleBox">
                        让每天都变的高效和愉快！
                    </div>
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
                {showMenu === '1' && <HomePage setShowMenu={setShowMenu} />}
                {showMenu === '2' && <ScheduleManage />}
                {/* {showMenu === '2' && <Test />} */}
                {showMenu === '3' && <ScheduleSubscribe />}
                {/* {showMenu === '4' && <div>个性化配置</div>} */}
                {showMenu === '5' && <Setting />}
            </Layout>
        </div>
    )
}

export default Home