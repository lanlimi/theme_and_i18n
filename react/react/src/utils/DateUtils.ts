// 日期工具函数
// import i18n from '../i18n/config'; // 假设已配置i18n

// 获取月份数据
export const getMonthData = (year: number, month: number) => {
  const result = [];
  // 月份从0开始，所以需要-1
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  
  // 当月第一天是星期几（0-6，0是周日）
  const firstDayWeekday = firstDay.getDay();
  // 当月总天数
  const daysInMonth = lastDay.getDate();
  // 上月最后一天
  const lastDayOfPrevMonth = new Date(year, month - 1, 0).getDate();
  
  // 需要显示的上月末尾日期数量
  const prevMonthDaysCount = firstDayWeekday;
  // 需要显示的日期总数（保证显示6行）
  const totalDays = Math.ceil((prevMonthDaysCount + daysInMonth) / 7) * 7;
  // 需要显示的下月开头日期数量
  const nextMonthDaysCount = totalDays - prevMonthDaysCount - daysInMonth;
  
  // 添加上月末尾日期
  for (let i = prevMonthDaysCount - 1; i >= 0; i--) {
    result.push({
      date: lastDayOfPrevMonth - i,
      month: month - 1,
      year: month - 1 === 0 ? year - 1 : year,
      isCurrentMonth: false
    });
  }
  
  // 添加当月日期
  for (let i = 1; i <= daysInMonth; i++) {
    result.push({
      date: i,
      month: month,
      year: year,
      isCurrentMonth: true
    });
  }
  
  // 添加下月开头日期
  for (let i = 1; i <= nextMonthDaysCount; i++) {
    result.push({
      date: i,
      month: month + 1,
      year: month + 1 === 13 ? year + 1 : year,
      isCurrentMonth: false
    });
  }
  
  return result;
};

// 获取周数据
export const getWeekData = (date: Date) => {
  const result = [];
  const currentDay = date.getDay();
  
  // 获取本周一的日期
  const monday = new Date(date);
  monday.setDate(date.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
  
  // 生成一周7天的数据
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    
    result.push({
      date: day.getDate(),
      month: day.getMonth() + 1,
      year: day.getFullYear(),
      weekday: i
    });
  }
  
  return result;
};

// 获取24小时时间刻度
export const getHourLabels = () => {
  return Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
};

// 获取星期名称
export const getWeekdayNames = () => {
  return [
    // i18n.t('calendar.sunday'),
    // i18n.t('calendar.monday'),
    // i18n.t('calendar.tuesday'),
    // i18n.t('calendar.wednesday'),
    // i18n.t('calendar.thursday'),
    // i18n.t('calendar.friday'),
    // i18n.t('calendar.saturday')
    '周一',
    '周二',
    '周三',
    '周四',
    '周五',
    '周六',
    '周日',
  ];
};