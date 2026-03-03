import customCreateStyles from "@/utils/customCreateStyles"

export default customCreateStyles(({ token, css }) => ({
    // 整体布局
    LayoutStyle: css`
        width: 100%;
        height: 100%;
        background: ${token.colorBgElevated};
        display: flex;
        flex-direction: column;
        overflow: hidden;
    `,

    // 顶部信息区
    headerStyle: css`
        height: 72px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 32px;
        background: linear-gradient(135deg, ${token.colorHeader}, ${token.colorBgContainer});
        border-bottom: 1px solid ${token.colorBorder};
        backdrop-filter: blur(20px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    `,

    headerLeft: css`
        display: flex;
        align-items: center;
        gap: 20px;
    `,

    headerRight: css`
        display: flex;
        align-items: center;
        gap: 16px;
    `,

    // 用户信息卡片
    userInfo: css`
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 10px 20px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
        &:hover {
            background: rgba(255, 255, 255, 0.15);
            // transform: translateY(-2px);
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
            border-color: ${token.colorPrimary}40;
        }
    `,

    userInfoText: css`
        display: flex;
        flex-direction: column;
        gap: 4px;
    `,

    userName: css`
        font-size: 16px;
        font-weight: 700;
        color: ${token.colorText};
        letter-spacing: 0.3px;
    `,

    userEmail: css`
        font-size: 12px;
        color: ${token.colorTextSecondary};
    `,

    // 主体内容区 - 中下核心视图区 + 右下快捷信息区
    mainContainer: css`
        flex: 1;
        display: flex;
        overflow: hidden;
        padding: 20px;
        gap: 20px;
    `,

    // 中下核心视图区
    contentArea: css`
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 16px;
        overflow: hidden;
        background: ${token.colorBgContainer};
        border-radius: 24px;
        padding: 24px;
        border: 1px solid ${token.colorBorder};
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
    `,

    viewControls: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 20px;
        background: ${token.colorBgElevated};
        border-radius: 16px;
        border: 1px solid ${token.colorBorder};
    `,

    dateNavigation: css`
        display: flex;
        align-items: center;
        gap: 12px;
    `,

    navButton: css`
        width: 40px;
        height: 40px;
        border-radius: 12px;
        border: 1px solid ${token.colorBorder};
        background: transparent;
        color: ${token.colorText};
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        &:hover {
            background: ${token.colorPrimary};
            border-color: ${token.colorPrimary};
            color: white;
            transform: scale(1.1);
        }
    `,

    dateDisplay: css`
        font-size: 22px;
        font-weight: 700;
        color: ${token.colorText};
        min-width: 160px;
        text-align: center;
        letter-spacing: 0.5px;
    `,

    todayButton: css`
        padding: 10px 24px;
        border-radius: 12px;
        border: 1px solid ${token.colorBorder};
        background: transparent;
        color: ${token.colorText};
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 600;
        &:hover {
            background: ${token.colorPrimary};
            border-color: ${token.colorPrimary};
            color: white;
        }
    `,

    calendarContainer: css`
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 12px;
        overflow: hidden;
    `,

    // 月视图样式
    weekdayHeader: css`
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 10px;
        padding: 0 8px;
    `,

    weekdayItem: css`
        text-align: center;
        font-size: 14px;
        font-weight: 600;
        color: ${token.colorTextSecondary};
        padding: 14px 0;
        border-radius: 12px;
        background: ${token.colorBgElevated};
    `,

    monthGrid: css`
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 10px;
        flex: 1;
        overflow: hidden;
    `,

    dayCell: css`
        padding: 12px;
        border-radius: 16px;
        border: 2px solid transparent;
        background: ${token.colorBgElevated};
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-height: 100px;
        &:hover {
            border-color: ${token.colorPrimary};
            transform: translateY(-4px);
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
        }
    `,

    dayCellToday: css`
        background: linear-gradient(135deg, ${token.colorPrimary}15, ${token.colorPrimary}25);
        border-color: ${token.colorPrimary};
        box-shadow: 0 4px 16px ${token.colorPrimary}30;
    `,

    dayCellOtherMonth: css`
        opacity: 0.4;
    `,

    dayNumber: css`
        font-size: 16px;
        font-weight: 700;
        color: ${token.colorText};
        text-align: center;
        padding: 4px 0;
    `,

    daySchedules: css`
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex: 1;
        overflow: hidden;
    `,

    dayScheduleItem: css`
        font-size: 11px;
        padding: 6px 10px;
        border-radius: 8px;
        color: white;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 500;
        letter-spacing: 0.3px;
    `,

    dayScheduleItemHigh: css`
        background: linear-gradient(135deg, #ff4d4f, #ff7875);
    `,

    dayScheduleItemMedium: css`
        background: linear-gradient(135deg, #faad14, #ffc53d);
    `,

    dayScheduleItemLow: css`
        background: linear-gradient(135deg, #1890ff, #40a9ff);
    `,

    dayScheduleItemCompleted: css`
        background: linear-gradient(135deg, #52c41a, #73d13d);
    `,

    moreSchedules: css`
        font-size: 11px;
        color: ${token.colorTextSecondary};
        text-align: center;
        padding: 4px;
    `,

    // 周视图样式
    weekView: css`
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 12px;
        flex: 1;
        overflow: hidden;
    `,

    weekDay: css`
        border-radius: 16px;
        border: 2px solid ${token.colorBorder};
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background: ${token.colorBgElevated};
        min-width: 0;
        flex-shrink: 1;
        overflow: hidden;
        -ms-overflow-style: none;
        scrollbar-width: none;

        &:hover {
            border-color: ${token.colorPrimary};
            // transform: translateY(-4px);
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
        }

        ::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
        }
    `,

    weekDayToday: css`
        background: linear-gradient(135deg, ${token.colorPrimary}15, ${token.colorPrimary}25);
        border-color: ${token.colorPrimary};
        box-shadow: 0 4px 16px ${token.colorPrimary}30;
    `,

    weekDayHeader: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 8px;
        border-bottom: 1px solid ${token.colorBorder};
    `,

    weekDayDate: css`
        font-size: 24px;
        font-weight: 800;
        color: ${token.colorText};
        line-height: 1;
    `,

    weekDayWeekday: css`
        font-size: 12px;
        color: ${token.colorTextSecondary};
        font-weight: 500;
    `,

    weekDaySchedules: css`
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
        overflow-y: auto;
        overflow-x: hidden;

        ::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
        }
    `,

    weekScheduleItem: css`
        font-size: 12px;
        padding: 10px 12px;
        border-radius: 10px;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
        &:hover {
            // transform: translateX(4px);
            padding: 12px 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
    `,

    weekScheduleItemHigh: css`
        background: linear-gradient(135deg, #ff4d4f, #ff7875);
    `,

    weekScheduleItemMedium: css`
        background: linear-gradient(135deg, #faad14, #ffc53d);
    `,

    weekScheduleItemLow: css`
        background: linear-gradient(135deg, #1890ff, #40a9ff);
    `,

    weekScheduleItemCompleted: css`
        background: linear-gradient(135deg, #52c41a, #73d13d);
    `,

    // 右下快捷信息区
    sidePanel: css`
        width: ${token.sidePanelWidth}px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    `,

    // 今日日程区
    todaySection: css`
        flex: 1;
        background: ${token.colorBgContainer};
        border-radius: 24px;
        padding: 24px;
        border: 1px solid ${token.colorBorder};
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    `,

    // 高优先级日程区
    prioritySection: css`
        background: linear-gradient(135deg, ${token.colorBgContainer}, ${token.colorBgElevated});
        border-radius: 24px;
        padding: 24px;
        border: 2px solid ${token.colorPrimary}40;
        box-shadow: 0 8px 32px ${token.colorPrimary}20;
    `,

    sideSectionTitle: css`
        font-size: 18px;
        font-weight: 700;
        color: ${token.colorText};
        display: flex;
        align-items: center;
        gap: 10px;
        padding-bottom: 16px;
        border-bottom: 2px solid ${token.colorBorder};
        margin-bottom: 16px;
    `,

    scheduleCard: css`
        background: ${token.colorBgElevated};
        border-radius: 16px;
        padding: 16px;
        border: 1px solid ${token.colorBorder};
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
        position: relative;
        overflow: hidden;
        margin-bottom: 12px;
        min-height: 120px;

        &:hover {
            // border-color: ${token.colorPrimary};
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            // background: linear-gradient(90deg, ${token.colorPrimary}, ${token.colorPrimary}dd);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        &:hover::before {
            opacity: 1;
        }
    `,

    scheduleCardTitle: css`
        font-size: 15px;
        font-weight: 600;
        color: ${token.colorText};
        margin-bottom: 10px;
        line-height: 1.4;
    `,

    scheduleCardTime: css`
        font-size: 13px;
        color: ${token.colorTextSecondary};
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 6px;
    `,

    scheduleCardPriority: css`
        display: inline-block;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    `,

    priorityHigh: css`
        background: linear-gradient(135deg, #ff4d4f15, #ff4d4f25);
        color: #ff4d4f;
        border: 1px solid #ff4d4f30;
    `,

    priorityMedium: css`
        background: linear-gradient(135deg, #faad1415, #faad1425);
        color: #faad14;
        border: 1px solid #faad1430;
    `,

    priorityLow: css`
        background: linear-gradient(135deg, #1890ff15, #1890ff25);
        color: #1890ff;
        border: 1px solid #1890ff30;
    `,

    priorityCompleted: css`
        background: linear-gradient(135deg, #52c41a15, #52c41a25);
        color: #52c41a;
        border: 1px solid #52c41a30;
    `,

    importantScheduleCard: css`
        background: linear-gradient(135deg, ${token.colorPrimary}10, ${token.colorPrimary}20);
        border: 2px solid ${token.colorPrimary};
        box-shadow: 0 8px 24px ${token.colorPrimary}20;
        margin-bottom: 0;
    `,

    // 弹窗样式
    modalContent: css`
        max-height: 70vh;
        overflow-y: auto;
    `,

    modalScheduleList: css`
        display: flex;
        flex-direction: column;
        gap: 12px;
    `,

    modalScheduleItem: css`
        padding: 16px;
        border-radius: 12px;
        background: ${token.colorBgContainer};
        border: 1px solid ${token.colorBorder};
        transition: all 0.3s ease;
        &:hover {
            border-color: ${token.colorPrimary};
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
    `,

    modalScheduleTitle: css`
        font-size: 15px;
        font-weight: 600;
        color: ${token.colorText};
        margin-bottom: 8px;
    `,

    modalScheduleTime: css`
        font-size: 13px;
        color: ${token.colorTextSecondary};
        margin-bottom: 8px;
    `,

    modalScheduleDescription: css`
        font-size: 13px;
        color: ${token.colorTextSecondary};
        line-height: 1.6;
    `,

    createButton: css`
        margin-top: 16px;
        width: 100%;
        height: 44px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 14px;
    `,

    emptyState: css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        color: ${token.colorTextSecondary};
        font-size: 14px;
    `,

    emptyIcon: css`
        font-size: 48px;
        margin-bottom: 16px;
        opacity: 0.5;
    `,

    scheduleList: css`
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 10px 0;

        ::-webkit-scrollbar {
            width: 0;
            height: 0;
        }
    `,
}))