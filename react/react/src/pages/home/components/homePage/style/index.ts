import customCreateStyles from "@/utils/customCreateStyles"

export default customCreateStyles(({ token, css }) => ({
    LayoutStyle: css`
        // width: 100%;
        height: 100%;
        background: ${token.colorBgElevated};
    `,

    headerStyle: css`
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        background: ${token.colorHeader};
    `,
}))