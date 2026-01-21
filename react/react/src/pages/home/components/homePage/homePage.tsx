import React, { useState } from 'react';
import { AntDesignOutlined, ContainerOutlined, DesktopOutlined, LeftOutlined, MoonOutlined, PieChartOutlined, RightOutlined, SunOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Avatar, Flex, Layout, Menu, Segmented, theme, type MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { getMonthData, getWeekdayNames } from '@/utils/DateUtils';
import useStyles from './style/index';
import appStore from '@/stores/appStore';
import themeStore from '@/stores/theme';


interface HomePageProps {
  schedules?: any;
}


const HomePage: React.FC<HomePageProps> = ({ schedules = [] }) => {

  const { styles } = useStyles();

  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const date = currentDate.getDate();

  const monthData = getMonthData(year, month);
  const weekdayNames = getWeekdayNames();
  const today = new Date();
  const [viewType, setViewType] = useState('week');

  // 将日期数据转换为7列网格
  const weeks = [];
  for (let i = 0; i < monthData.length; i += 7) {
    weeks.push(monthData.slice(i, i + 7));
  }
  console.log('周数据', weeks);
  // 切换视图
  const handleViewChange = (type: any) => {
    setViewType(type);
  };

  // 切换月份
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, date));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, date));
  };

  // 回到今天
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // 获取某天的日程
  const getDaySchedules = (dateObj: any) => {
    return schedules.filter((schedule: any) => {
      const scheduleDate = new Date(schedule.startTime);
      return (
        scheduleDate.getFullYear() === dateObj.year &&
        scheduleDate.getMonth() + 1 === dateObj.month &&
        scheduleDate.getDate() === dateObj.date
      );
    });
  };

  const [themeMode, setThemeMode] = useState('light');


    // 切换到亮色主题
  const handleSwitchToLight = () => {
    appStore.setThemeType('light');
    localStorage.setItem('themeType', 'light');
    // 更新根元素背景颜色，避免刷新页面或和切换路由时，或者在切换主题后切换路由时html背景色与主题色不符合造成闪烁
    document.documentElement.style.backgroundColor = 'white';
    themeStore.setTheme('light');
  };

  // 切换到暗色主题
  const handleSwitchToDark = () => {
    appStore.setThemeType('dark');
    localStorage.setItem('themeType', 'dark');
    // 更新根元素背景颜色，避免刷新页面或和切换路由时，或者在切换主题后切换路由时html背景色与主题色不符合造成闪烁
    document.documentElement.style.backgroundColor = '#151515';
    themeStore.setTheme('dark');
  };

  // 切换到跟随系统主题
  const handleSwitchToAuto = () => {
    // 系统主题是否为夜晚模式
    let isDark = window.matchMedia("(prefers-color-scheme: dark)")

    // 在不手动切换浏览器主题的情况下，isDark.addEventListener('change',function(){})不会触发监视
    // 所以在从亮色或者暗色模式切换到自动模式时，判断系统主题是否与切换前是否一致，不一致就切换成系统主题
    // 系统主题为暗黑模式，且当前主题为亮色时，切换为暗色主题
    if (appStore.themeType === 'dark' && !isDark.matches) {
      // 更新根元素背景颜色，避免刷新页面或和切换路由时，或者在切换主题后切换路由时html背景色与主题色不符合造成闪烁
      document.documentElement.style.backgroundColor = 'white';
      themeStore.setTheme('light');
    }
    // 系统主题为亮色模式，且当前主题为暗色时，切换为亮色主题
    if (appStore.themeType === 'light' && isDark.matches) {
      // 更新根元素背景颜色，避免刷新页面或和切换路由时，或者在切换主题后切换路由时html背景色与主题色不符合造成闪烁
      document.documentElement.style.backgroundColor = '#151515';
      themeStore.setTheme('dark');
    }

    appStore.setThemeType('auto');
    localStorage.setItem('themeType', 'auto');
    isDark.addEventListener('change', function () {
      // console.log(`当前的主题是:${this.matches?'light':'dark'}`)
      if (this.matches && appStore.themeType === 'auto') {
        // 更新根元素背景颜色，避免刷新页面或和切换路由时，或者在切换主题后切换路由时html背景色与主题色不符合造成闪烁
        document.documentElement.style.backgroundColor = '#151515';
        themeStore.setTheme('dark');
        return
      }
      // 更新根元素背景颜色，避免刷新页面或和切换路由时，或者在切换主题后切换路由时html背景色与主题色不符合造成闪烁
      document.documentElement.style.backgroundColor = 'white';
      themeStore.setTheme('light');
    })
  };

  return (
    <Layout
      className={styles.LayoutStyle}
    // style={{
    //   height: '100%',
    //   background: '#000000',
    // }}
    >
      {/* <Header style={{ background: '#282828', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}> */}
      <Header className={styles.headerStyle}>
        <Segmented style={{color: '#ffffff'}} options={['周视图', '月视图']} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Segmented
            value={themeMode}
            shape="round"
            options={[
              { value: 'light', icon: <SunOutlined /> },
              { value: 'dark', icon: <MoonOutlined /> }
            ]}
            onChange={(value) => {
              if (value === 'light') {
                handleSwitchToLight();
              } else if (value === 'dark') {
                handleSwitchToDark();
              } else if (value === 'auto') {
                handleSwitchToAuto();
              }
              setThemeMode(value);
            }}
          />
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff' }}>
            测试
          </div>
          <Avatar
            size="large"
            icon={<AntDesignOutlined />}
          />
        </div>
      </Header>
      <div style={{
        flex: 1,
        width: '100%',
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ height: '100%', flex: 1, backgroundColor: '#464646', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
            <LeftOutlined onClick={handlePrevMonth} />
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff' }}>
              {year}年{month}月
            </div>
            <RightOutlined onClick={handleNextMonth} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', height: '48px' }}>
            {weekdayNames.map(item => (
              <div key={item} style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {item}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', flex: 1 }}>
            {monthData.map((item, index) => (
              <div key={index} style={{
                padding: '8px',
                backgroundColor: '#333333',
                color: '#ffffff',
                textAlign: 'center',
              }}>
                {item.date}
              </div>
            ))}
          </div>

        </div>
        <div style={{ width: '20%', height: '100%', backgroundColor: '#282828', padding: '16px' }}></div>
      </div>
    </Layout>
  );
};

export default HomePage;
