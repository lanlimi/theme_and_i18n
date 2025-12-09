import { customCreateStyles } from '@/utils/customCreateStyles';

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
  `,
  }
})


