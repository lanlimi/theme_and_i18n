import customCreateStyles from "@/utils/customCreateStyles"

export default customCreateStyles(({ token, css }) => ({
    settingContainer: css`
        width: 100%;
        height: 100%;
        background: ${token.colorBgElevated};
        display: flex;
        flex-direction: column;
    `,
    
    header: css`
        height: 64px;
        background: ${token.colorHeader};
        display: flex;
        align-items: center;
        padding: 0 24px;
        border-bottom: 1px solid ${token.colorBorder};
        font-size: 18px;
        font-weight: 600;
        color: ${token.colorText};
    `,
    
    content: css`
        flex: 1;
        padding: 32px;
        overflow-y: auto;
    `,
    
    card: css`
        margin-bottom: 24px;
        border-radius: 8px;
        overflow: hidden;
    `,
    
    cardHeader: css`
        padding: 16px 24px;
        border-bottom: 1px solid ${token.colorBorder};
        font-size: 16px;
        font-weight: 600;
        color: ${token.colorText};
    `,
    
    cardBody: css`
        padding: 24px;
    `,
    
    userInfoSection: css`
        display: flex;
        flex-direction: column;
        gap: 24px;
    `,
    
    avatarContainer: css`
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
    `,
    
    avatar: css`
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid ${token.colorBorder};
    `,
    
    avatarUpload: css`
        margin-top: 8px;
    `,
    
    infoGrid: css`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
    `,
    
    infoItem: css`
        display: flex;
        flex-direction: column;
        gap: 8px;
    `,
    
    label: css`
        font-size: 14px;
        font-weight: 500;
        color: ${token.colorTextSecondary};
    `,
    
    value: css`
        font-size: 16px;
        color: ${token.colorText};
    `,
    
    input: css`
        width: 100%;
    `,
    
    textArea: css`
        width: 100%;
        min-height: 100px;
    `,
    
    select: css`
        width: 100%;
    `,
    
    buttonGroup: css`
        display: flex;
        gap: 12px;
        margin-top: 24px;
    `,
    
    loadingContainer: css`
        display: flex;
        justify-content: center;
        align-items: center;
        height: 300px;
    `,
    
    modalContent: css`
        padding: 24px;
    `,
    
    modalForm: css`
        display: flex;
        flex-direction: column;
        gap: 16px;
    `,
}))