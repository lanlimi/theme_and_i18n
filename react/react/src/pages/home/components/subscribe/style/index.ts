import customCreateStyles from "@/utils/customCreateStyles"

export default customCreateStyles(({ token, css }) => ({
    subscribeContainer: css`
        width: 100%;
        height: 100%;
        background: ${token.colorBgElevated};
        display: flex;
        flex-direction: column;
    `,
    
    searchArea: css`
        height: 80px;
        background: linear-gradient(135deg, ${token.colorHeader}, ${token.colorBgContainer});
        display: flex;
        align-items: center;
        padding: 0 24px;
        border-bottom: 1px solid ${token.colorBorder};
    `,
    
    searchInput: css`
        width: 400px;
        margin-right: 12px;
    `,
    
    contentArea: css`
        flex: 1;
        padding: 24px;
        overflow-y: auto;
    `,
    
    loadingContainer: css`
        display: flex;
        justify-content: center;
        align-items: center;
        height: 300px;
    `,
    
    emptyContainer: css`
        display: flex;
        justify-content: center;
        align-items: center;
        height: 300px;
        color: ${token.colorTextSecondary};
        font-size: 16px;
    `,
    
    templateCard: css`
        margin-bottom: 16px;
        transition: all 0.3s ease;
        &:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
    `,
    
    templateHeader: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    `,
    
    templateTitle: css`
        font-size: 18px;
        font-weight: 600;
        color: ${token.colorText};
    `,
    
    templateDescription: css`
        font-size: 14px;
        color: ${token.colorTextSecondary};
        margin-bottom: 16px;
        line-height: 1.4;
    `,
    
    templateFooter: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 12px;
        border-top: 1px solid ${token.colorBorder};
    `,
    
    templateMeta: css`
        font-size: 12px;
        color: ${token.colorTextSecondary};
    `,
    
    scheduleItem: css`
        margin-bottom: 8px;
        padding: 12px;
        background: ${token.colorBgContainer};
        border-radius: 4px;
        border-left: 4px solid ${token.colorPrimary};
    `,
    
    scheduleTitle: css`
        font-size: 14px;
        font-weight: 500;
        color: ${token.colorText};
        margin-bottom: 4px;
    `,
    
    scheduleDetails: css`
        font-size: 12px;
        color: ${token.colorTextSecondary};
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
    `,
    
    timeInfo: css`
        white-space: nowrap;
    `,
    
    priorityBadge: css`
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
    `,
    
    priorityHigh: css`
        background-color: rgba(245, 34, 45, 0.1);
        color: ${token.colorError};
    `,
    
    priorityMedium: css`
        background-color: rgba(250, 173, 20, 0.1);
        color: ${token.colorWarning};
    `,
    
    priorityLow: css`
        background-color: rgba(82, 196, 26, 0.1);
        color: ${token.colorSuccess};
    `,
    
    statusBadge: css`
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
    `,
    
    statusPending: css`
        background-color: rgba(153, 153, 153, 0.1);
        color: ${token.colorTextSecondary};
    `,
    
    statusIn_progress: css`
        background-color: rgba(16, 142, 233, 0.1);
        color: ${token.colorPrimary};
    `,
    
    statusCompleted: css`
        background-color: rgba(82, 196, 26, 0.1);
        color: ${token.colorSuccess};
    `,
    
    paginationContainer: css`
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 24px 0;
        margin-top: 16px;
        border-top: 1px solid ${token.colorBorder};
    `,
}))