import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import '@/assets/less/index.less' // 导入全局less文件（阿里图标字体）
import { injectI18n } from './i18n'; // 在这里导入 i18n.js
injectI18n();

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
const root = createRoot(document.getElementById('root') as any)
root.render(<App />)
