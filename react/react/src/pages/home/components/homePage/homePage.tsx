import React, { useState, useEffect } from 'react';
import { Avatar, Modal, Form, Input, Select, DatePicker, Button, message, Empty, Segmented, ConfigProvider, Dropdown, type MenuProps } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { PlusOutlined, LeftOutlined, RightOutlined, CalendarOutlined, ClockCircleOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons';
import { getMonthData, getWeekdayNames, getWeekData } from '@/utils/DateUtils';
import useStyles from './style/index';
import userInfoStore from '@/stores/userInfo';
import { scheduleApi, type Schedule } from '@/api';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import appStore from '@/stores/appStore';
import themeStore from '@/stores/theme';
import { toJS } from 'mobx';
import { useTranslation } from '@/i18n';
import loadLanguageAsync from '@/locales/locales';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface HomePageProps {
  setShowMenu: any
}

const HomePage: React.FC<HomePageProps> = ({
  setShowMenu,
}) => {
  const { styles } = useStyles();
  const { t } = useTranslation();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'week' | 'month'>('week');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dayModalVisible, setDayModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [scheduleDetailModalVisible, setScheduleDetailModalVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [form] = Form.useForm();
  const [daySchedules, setDaySchedules] = useState<Schedule[]>([]);


  const [year, setYear] = useState<any>()
  const [month, setMonth] = useState<any>()

  useEffect(() => {
    setYear(currentDate.getFullYear())
    setMonth(currentDate.getMonth() + 1)
    console.log('切换到下个月', currentDate.getFullYear(), currentDate.getMonth() + 1)
  }, [currentDate])
  const today = new Date();

  const userInfo = userInfoStore.userInfo;
  console.log('用户信息', toJS(userInfo))

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response = await scheduleApi.getSchedules();
      const data = response as any;
      setSchedules(data.schedules);
    } catch (error: any) {
      message.error(error.response?.data?.error || '获取日程失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleViewChange = (type: 'week' | 'month') => {
    setViewType(type);
  };

  const handlePrevMonth = () => {
    if (viewType === 'week') {
      // 周视图：切换到上一周
      const prevWeek = new Date(currentDate);
      prevWeek.setDate(currentDate.getDate() - 7);
      setCurrentDate(prevWeek);
    } else {
      // 月视图：切换到上个月
      setCurrentDate(new Date(year, month - 2, 1));
    }
  };

  const handleNextMonth = () => {
    if (viewType === 'week') {
      // 周视图：切换到下一周
      const nextWeek = new Date(currentDate);
      nextWeek.setDate(currentDate.getDate() + 7);
      setCurrentDate(nextWeek);
    } else {
      // 月视图：切换到下个月
      setCurrentDate(new Date(year, month, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // 将UTC时间转换为本地日期字符串（YYYY-MM-DD）
  const getLocalDateString = (utcTimeStr: string) => {
    const date = new Date(utcTimeStr);
    // 确保使用本地时间，避免时区偏移问题
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 获取日程的样式类名
  const getScheduleClassName = (schedule: Schedule, view: 'day' | 'week') => {
    const baseClass = view === 'day' ? styles.dayScheduleItem : styles.weekScheduleItem;
    if (schedule.status === 'completed') {
      return `${baseClass} ${view === 'day' ? styles.dayScheduleItemCompleted : styles.weekScheduleItemCompleted}`;
    }
    switch (schedule.priority) {
      case 'high':
        return `${baseClass} ${view === 'day' ? styles.dayScheduleItemHigh : styles.weekScheduleItemHigh}`;
      case 'medium':
        return `${baseClass} ${view === 'day' ? styles.dayScheduleItemMedium : styles.weekScheduleItemMedium}`;
      case 'low':
        return `${baseClass} ${view === 'day' ? styles.dayScheduleItemLow : styles.weekScheduleItemLow}`;
      default:
        return baseClass;
    }
  };

  const getDaySchedules = (dateObj: Date) => {
    const targetDateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    return schedules.filter(schedule => {
      const scheduleDateStr = getLocalDateString(schedule.start_time);
      return scheduleDateStr === targetDateStr;
    });
  };

  // 获取今日所有日程（按时间顺序）
  const getTodaySchedules = () => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return schedules
      .filter(schedule => getLocalDateString(schedule.start_time) === todayStr)
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  };

  // 获取下一个高优先级日程
  const getNextHighPrioritySchedule = () => {
    const now = new Date();
    const highPrioritySchedules = schedules.filter(schedule => {
      return schedule.priority === 'high' && new Date(schedule.start_time) >= now;
    });
    if (highPrioritySchedules.length === 0) return null;

    return highPrioritySchedules.sort((a, b) => 
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    )[0];
  };

  const handleDayClick = (dateObj: Date) => {
    setSelectedDate(dateObj);
    setDaySchedules(getDaySchedules(dateObj));
    setDayModalVisible(true);
  };

  // 点击日程卡片显示详情
  const handleScheduleCardClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setScheduleDetailModalVisible(true);
  };

  const handleCreateSchedule = async (values: any) => {
    setLoading(true);
    try {
      const { timeRange, ...rest } = values;
      // 确保时间是本地时间，避免时区问题
      // 直接使用dayjs对象的format方法，避免toISOString()的时区转换
      await scheduleApi.createSchedule({
        ...rest,
        start_time: timeRange[0].format('YYYY-MM-DD HH:mm:ss'),
        end_time: timeRange[1].format('YYYY-MM-DD HH:mm:ss')
      });
      message.success('创建日程成功');
      setCreateModalVisible(false);
      form.resetFields();
      fetchSchedules();
    } catch (error: any) {
      message.error(error.response?.data?.error || '创建日程失败');
    } finally {
      setLoading(false);
    }
  };

  const monthData = getMonthData(year, month);
  const weekdayNames = getWeekdayNames();
  const weekData = getWeekData(currentDate);
  console.log('周数据', weekData)

  const isToday = (dateObj: Date) => {
    return (
      dateObj.getFullYear() === today.getFullYear() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getDate() === today.getDate()
    );
  };

  const isOtherMonth = (dateObj: Date) => {
    return dateObj.getMonth() !== currentDate.getMonth();
  };

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const formatDate = (dateObj: Date) => {
    return `${dateObj.getMonth() + 1}${t("月")}${dateObj.getDate()}${t("日")}`;
  };

  const getPriorityText = (priority: string) => {
    const map = { high: '高', medium: '中', low: '低' };
    return map[priority as keyof typeof map] || '中';
  };

  const getStatusText = (status: string) => {
    const map = { pending: '待处理', in_progress: '进行中', completed: '已完成' };
    return map[status as keyof typeof map] || '待处理';
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


  const handleSelectChange = (value: string) => {
    console.log(`selected ${value}`);
    localStorage.setItem('i18n_Language', value);
    loadLanguageAsync(value);
  };

  return (
    <ConfigProvider locale={zhCN}>
      <div className={styles.LayoutStyle}>
      {/* 顶部信息区：展示当前登录用户的昵称与头像 */}
      <div className={styles.headerStyle}>
        <div className={styles.headerLeft}>
          <div 
            className={styles.userInfo}
            onClick={() => setShowMenu('5')}
          >
            <Avatar 
              size={48} 
              src={userInfo.avatar} 
              icon={<CalendarOutlined />}
            />
            <div className={styles.userInfoText}>
              <div className={styles.userName}>{userInfo.name || t('用户')}</div>
              <div className={styles.userEmail}>{userInfo.email}</div>
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <Segmented 
            value={viewType}
            options={[{ value: 'week', label: t('周视图') }, { value: 'month', label: t('月视图') }]}
            onChange={(value) => handleViewChange(value as 'week' | 'month')}
          />
          <Segmented
            value={appStore.themeType}
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
              // setThemeMode(value);
            }}
          />
          <Select
            defaultValue={localStorage.getItem('i18n_Language') || '中文'}
            style={{ width: 120 }}
            onChange={handleSelectChange}
            options={[
              { value: 'zh-CN', label: '中文' },
              { value: 'en-US', label: 'English' },
            ]}
          />
        </div>
      </div>

      {/* 主体内容区 */}
      <div className={styles.mainContainer}>
        {/* 中下核心视图区：周视图与月视图切换 */}
        <div className={styles.contentArea}>
          <div className={styles.viewControls}>
            <div className={styles.dateNavigation}>
              <button className={styles.navButton} onClick={handlePrevMonth}>
                <LeftOutlined />
              </button>
              <div className={styles.dateDisplay}>
                {year}{t("年")}{month}{t("月")}
              </div>
              <button className={styles.navButton} onClick={handleNextMonth}>
                <RightOutlined />
              </button>
              <button className={styles.todayButton} onClick={handleToday}>
                {t("今天")}
              </button>
            </div>
          </div>

          <div className={styles.calendarContainer}>
            {/* 月视图 */}
            {viewType === 'month' && (
              <>
                <div className={styles.weekdayHeader}>
                  {weekdayNames.map(day => (
                    <div key={day} className={styles.weekdayItem}>
                      {t(day)}
                    </div>
                  ))}
                </div>

                <div className={styles.monthGrid}>
                  {monthData.map((item, index) => {
                    const dateObj = new Date(item.year, item.month - 1, item.date);
                    const daySchedules = getDaySchedules(dateObj);
                    return (
                      <div 
                        key={index}
                        className={`${styles.dayCell} ${
                          isToday(dateObj) ? styles.dayCellToday : ''
                        } ${
                          isOtherMonth(dateObj) ? styles.dayCellOtherMonth : ''
                        }`}
                        onClick={() => handleDayClick(dateObj)}
                      >
                        <div className={styles.dayNumber}>{item.date}</div>
                        <div className={styles.daySchedules}>
                          {daySchedules.slice(0, 3).map(schedule => (
                            <div key={schedule.id} className={getScheduleClassName(schedule, 'day')}>
                              {schedule.title}
                            </div>
                          ))}
                          {daySchedules.length > 3 && (
                            <div className={styles.moreSchedules}>
                              +{daySchedules.length - 3}{t("更多")}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* 周视图 */}
            {viewType === 'week' && (
              <div className={styles.weekView}>
                {weekData.map((day, index) => {
                  const dateObj = new Date(day.year, day.month - 1, day.date);
                  const daySchedules = getDaySchedules(dateObj);
                  return (
                    <div 
                      key={index}
                      className={`${styles.weekDay} ${
                        isToday(dateObj) ? styles.weekDayToday : ''
                      }`}
                      onClick={() => handleDayClick(dateObj)}
                    >
                      <div className={styles.weekDayHeader}>
                        <div className={styles.weekDayDate}>{day.date}</div>
                        <div className={styles.weekDayWeekday}>{weekdayNames[day.weekday]}</div>
                      </div>
                      <div className={styles.weekDaySchedules}>
                        {daySchedules.length === 0 ? (
                          <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>📅</div>
                            <div>{t('无日程')}</div>
                          </div>
                        ) : (
                          daySchedules.map(schedule => (
                            <div 
                              key={schedule.id}
                              className={getScheduleClassName(schedule, 'week')}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDayClick(dateObj);
                              }}
                            >
                              <div>{schedule.title}</div>
                              <div style={{ fontSize: 10, opacity: 0.9 }}>
                                {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* 右下快捷信息区 */}
        <div className={styles.sidePanel}>
          {/* 上半部分：今日所有日程 */}
          <div className={styles.todaySection}>
            <div className={styles.sideSectionTitle}>
              <ClockCircleOutlined /> {t('今日日程')}
            </div>
            <div className={styles.scheduleList}>
              {getTodaySchedules().length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>📋</div>
                  <div>{t('今日暂无日程')}</div>
                </div>
              ) : (
                getTodaySchedules().map(schedule => (
                  <div 
                    key={schedule.id}
                    className={styles.scheduleCard}
                    onClick={() => handleScheduleCardClick(schedule)}
                  >
                    <div className={styles.scheduleCardTitle}>{schedule.title}</div>
                    <div className={styles.scheduleCardTime}>
                      <CalendarOutlined /> {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                    </div>
                    <span className={`${styles.scheduleCardPriority} ${styles[`priority${schedule.priority.charAt(0).toUpperCase() + schedule.priority.slice(1)}`]}`}>
                      {getPriorityText(schedule.priority)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 下半部分：下一个高优先级日程 */}
          <div className={styles.prioritySection}>
            <div className={styles.sideSectionTitle}>
              <CalendarOutlined /> {t('重要日程')}
            </div>
            {getNextHighPrioritySchedule() ? (
              <div 
                className={`${styles.scheduleCard} ${styles.importantScheduleCard}`}
                onClick={() => handleScheduleCardClick(getNextHighPrioritySchedule()!)}
              >
                <div className={styles.scheduleCardTitle}>{getNextHighPrioritySchedule()?.title}</div>
                <div className={styles.scheduleCardTime}>
                  <CalendarOutlined /> {formatDate(new Date(getNextHighPrioritySchedule()!.start_time))} {formatTime(getNextHighPrioritySchedule()!.start_time)}
                </div>
                <span className={`${styles.scheduleCardPriority} ${styles.priorityHigh}`}>
                  {getPriorityText(getNextHighPrioritySchedule()!.priority)}
                </span>
                {getNextHighPrioritySchedule()!.description && (
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 10, lineHeight: 1.6 }}>
                    {getNextHighPrioritySchedule()!.description}
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>⭐</div>
                <div>{t("暂无高优先级日程")}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        title={`${selectedDate ? formatDate(selectedDate) : ''}${t("的日程")}`}
        open={dayModalVisible}
        onCancel={() => setDayModalVisible(false)}
        footer={null}
        width={600}
      >
        <div className={styles.modalContent}>
          {daySchedules.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📅</div>
              <div>{t('暂无日程')}</div>
            </div>
          ) : (
            <div className={styles.modalScheduleList}>
              {daySchedules.map(schedule => (
                <div 
                  key={schedule.id} 
                  className={styles.modalScheduleItem}
                  onClick={() => {
                    setDayModalVisible(false);
                    handleScheduleCardClick(schedule);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.modalScheduleTitle}>{schedule.title}</div>
                  <div className={styles.modalScheduleTime}>
                    <ClockCircleOutlined /> {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
                    <span className={`${styles.scheduleCardPriority} ${styles[`priority${schedule.priority.charAt(0).toUpperCase() + schedule.priority.slice(1)}`]}`}>
                      {getPriorityText(schedule.priority)}
                    </span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                      {getStatusText(schedule.status)}
                    </span>
                  </div>
                  {schedule.description && (
                    <div className={styles.modalScheduleDescription}>
                      {schedule.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <Button 
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setDayModalVisible(false);
              setCreateModalVisible(true);
            }}
            className={styles.createButton}
          >
            {t("新建日程")}
          </Button>
        </div>
      </Modal>

      <Modal
        title={t("创建日程")}
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          onFinish={handleCreateSchedule}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label={t("标题")}
            rules={[{ required: true, message: t('请输入标题') }]}
          >
            <Input placeholder={t("请输入日程标题")} />
          </Form.Item>
          <Form.Item
            name="description"
            label={t("描述")}
          >
            <Input.TextArea placeholder={t("请输入日程描述")} rows={3} />
          </Form.Item>
          <Form.Item
            name="timeRange"
            label={t("时间范围")}
            rules={[{ required: true, message: t('请选择时间范围') }]}
          >
            <RangePicker 
              showTime 
              format="YYYY-MM-DD HH:mm:ss"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name="priority"
            label={t("优先级")}
            initialValue="medium"
          >
            <Select>
              <Option value="high">{t("高")}</Option>
              <Option value="medium">{t("中")}</Option>
              <Option value="low">{t("低")}</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label={t("状态")}
            initialValue="pending"
          >
            <Select>
              <Option value="pending">{t("待处理")}</Option>
              <Option value="in_progress">{t("进行中")}</Option>
              <Option value="completed">{t("已完成")}</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }} loading={loading}>
              {t("确定")}
            </Button>
            <Button onClick={() => setCreateModalVisible(false)}>
              {t("取消")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 日程详情弹窗 */}
      <Modal
        title={t("日程详情")}
        open={scheduleDetailModalVisible}
        onCancel={() => setScheduleDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setScheduleDetailModalVisible(false)}>
            {t("关闭")}
          </Button>
        ]}
        width={500}
      >
        {selectedSchedule && (
          <div className={styles.modalContent}>
            <div style={{ marginBottom: 16 }}>
              <div className={styles.modalTextStyle}>{t("标题")}</div>
              <div className={styles.infoTextStyle}>{selectedSchedule.title}</div>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <div className={styles.modalTextStyle}>{t("时间")}</div>
              <div className={styles.infoTextStyle}>
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                {formatDate(new Date(selectedSchedule.start_time))} {formatTime(selectedSchedule.start_time)} - {formatTime(selectedSchedule.end_time)}
              </div>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <div className={styles.modalTextStyle}>优先级</div>
              <span className={`${styles.scheduleCardPriority} ${styles[`priority${selectedSchedule.priority.charAt(0).toUpperCase() + selectedSchedule.priority.slice(1)}`]}`}>
                {getPriorityText(selectedSchedule.priority)}
              </span>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <div className={styles.modalTextStyle}>{t("状态")}</div>
              <div className={styles.infoTextStyle}>{getStatusText(selectedSchedule.status)}</div>
            </div>
            
            {selectedSchedule.description && (
              <div style={{ marginBottom: 16 }}>
                <div className={styles.modalTextStyle}>{t("描述")}</div>
                <div style={{ fontSize: 14, lineHeight: 1.6, padding: 12, background: 'rgba(0,0,0,0.02)', borderRadius: 8 }}>
                  {selectedSchedule.description}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
      </div>
    </ConfigProvider>
  );
};

export default HomePage;