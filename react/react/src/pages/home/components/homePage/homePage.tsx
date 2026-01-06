import React, { useState } from 'react';
import { AntDesignOutlined, ContainerOutlined, DesktopOutlined, LeftOutlined, PieChartOutlined, RightOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Avatar, Flex, Layout, Menu, Segmented, theme, type MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { getMonthData, getWeekdayNames } from '@/utils/DateUtils';


interface HomePageProps {
  schedules?: any;
}


const HomePage: React.FC<HomePageProps> = ({ schedules = [] }) => {
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

  return (
    <Layout style={{
      height: '100%',
      background: '#000000',
    }}>
      <Header style={{ background: '#282828', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>
        <Segmented options={['周视图', '月视图']} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
