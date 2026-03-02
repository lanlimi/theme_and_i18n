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
        width: 20%;
        background: ${token.colorBgContainer};
      }

      .ant-menu {
        backgound: ${token.colorBgContainer}
      }
  `,
  }
})


