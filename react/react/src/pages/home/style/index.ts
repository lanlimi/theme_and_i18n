import customCreateStyles from '@/utils/customCreateStyles';

export default customCreateStyles(({ token, css }) => {
  return {

    root: css`
      height: 100vh;
      width: 100vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: skyblue;

      .titleBox {
        background: ${token.colorBgContainer};
        height: 72px;
        padding: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: ${token.colorText}
      }

      .LayoutStyle {
        width: 100%;
        height: 100%;
      }

      .siderStyle{
        width: ${token.siderStyleWidth}px !important;
        background: ${token.colorBgContainer};
        flex: 1 !important;
        min-width: ${token.siderStyleWidth}px !important;
      }

      .ant-menu {
        backgound: ${token.colorTextSecondary} !important;
      }

      .MenuStyle {
        background: ${token.colorBgContainer} !important;
        
        
        .ant-menu {
          background: ${token.colorBgContainer} !important;
        }

        .ant-menu-item {
          color: ${token.colorText} !important;
        }

        .ant-menu-item-selected {
          background: ${token.colorTextSecondary} !important;
          color: #ffffff !important;
        }

        .ant-menu-item:hover {
          background: ${token.colorTextSecondary} !important;
        }
      }
  `,
  }
})


