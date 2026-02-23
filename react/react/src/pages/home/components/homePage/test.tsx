// d:\theme_and_i18n\theme_and_i18n\react\react\src\pages\home\components\homePage\homePage.tsx
import React, { useState, useEffect } from 'react';
import { AntDesignOutlined, LeftOutlined, RightOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';
import { Avatar, Layout, Segmented, message, Modal, Form, Input, Select, DatePicker, Button } from 'antd';
import { getMonthData, getWeekdayNames } from '@/utils/DateUtils';
import useStyles from './style/index';
import appStore from '@/stores/appStore';
import themeStore from '@/stores/theme';
import { scheduleApi, type Schedule, type CreateScheduleRequest } from '@/api';

interface HomePageProps {
  schedules?: any;
}

const Test: React.FC<HomePageProps> = () => {
  const { styles } = useStyles();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const date = currentDate.getDate();

  const monthData = getMonthData(year, month);
  const weekdayNames = getWeekdayNames();

  const weeks = [];
  for (let i = 0; i < monthData.length; i += 7) {
    weeks.push(monthData.slice(i, i + 7));
  }

  const [themeMode, setThemeMode] = useState('light');

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response: any = await scheduleApi.getSchedules();
      setSchedules(response?.schedules);
    } catch (error: any) {
      message.error('获取日程列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async (values: any) => {
    try {
      const data: CreateScheduleRequest = {
        title: values.title,
        description: values.description,
        start_time: values.start_time.format('YYYY-MM-DD HH:mm:ss'),
        end_time: values.end_time.format('YYYY-MM-DD HH:mm:ss'),
        priority: values.priority,
        status: values.status || 'pending',
      };
      await scheduleApi.createSchedule(data);
      message.success('创建日程成功');
      setIsModalOpen(false);
      form.resetFields();
      fetchSchedules();
    } catch (error: any) {
      message.error('创建日程失败');
    }
  };

  const handleSwitchToLight = () => {
    appStore.setThemeType('light');
    localStorage.setItem('themeType', 'light');
    document.documentElement.style.backgroundColor = 'white';
    themeStore.setTheme('light');
  };

  const handleSwitchToDark = () => {
    appStore.setThemeType('dark');
    localStorage.setItem('themeType', 'dark');
    document.documentElement.style.backgroundColor = '#151515';
    themeStore.setTheme('dark');
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, date));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, date));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getDaySchedules = (dateObj: any) => {
    return schedules.filter((schedule: Schedule) => {
      const scheduleDate = new Date(schedule.start_time);
      return (
        scheduleDate.getFullYear() === dateObj.year &&
        scheduleDate.getMonth() + 1 === dateObj.month &&
        scheduleDate.getDate() === dateObj.date
      );
    });
  };

  return (
    <Layout className={styles.LayoutStyle}>
      <Layout.Header className={styles.headerStyle}>
        <Segmented style={{ color: '#ffffff' }} options={['周视图', '月视图']} />

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
              }
              setThemeMode(value);
            }}
          />
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff' }}>
            测试
          </div>
          <Avatar size="large" icon={<AntDesignOutlined />} />
        </div>
      </Layout.Header>
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
            {monthData.map((item, index) => {
              const daySchedules = getDaySchedules(item);
              return (
                <div 
                  key={index} 
                  style={{
                    padding: '8px',
                    backgroundColor: '#333333',
                    color: '#ffffff',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => setIsModalOpen(true)}
                >
                  <div>{item.date}</div>
                  {daySchedules.map((schedule: Schedule) => (
                    <div key={schedule.id} style={{ fontSize: '12px', marginTop: '4px', padding: '2px', backgroundColor: schedule.priority === 'high' ? '#ff4d4f' : schedule.priority === 'medium' ? '#faad14' : '#52c41a', borderRadius: '4px' }}>
                      {schedule.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ width: '20%', height: '100%', backgroundColor: '#282828', padding: '16px' }}></div>
      </div>

      <Modal
        title="创建日程"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateSchedule} layout="vertical">
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入标题" />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea placeholder="请输入描述" rows={4} />
          </Form.Item>
          <Form.Item
            name="start_time"
            label="开始时间"
            rules={[{ required: true, message: '请选择开始时间' }]}
          >
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="end_time"
            label="结束时间"
            rules={[{ required: true, message: '请选择结束时间' }]}
          >
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="priority"
            label="优先级"
            rules={[{ required: true, message: '请选择优先级' }]}
          >
            <Select placeholder="请选择优先级">
              <Select.Option value="high">高</Select.Option>
              <Select.Option value="medium">中</Select.Option>
              <Select.Option value="low">低</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              创建
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Test;