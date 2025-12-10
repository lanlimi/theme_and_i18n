import { lazy, Suspense, useEffect, useState } from 'react'
import './App.css'
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from 'antd-style';
import { ConfigProvider } from 'antd';
import i18n from "i18next";
import themeStore from './stores/theme';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import { useAppStore } from './stores';
import light from './config/light.json'
import dark from './config/dark.json'
import loadLanguageAsync from './locales/locales';

// 1、优先完成国际化配置
// 2、阿里icon组件（可变色icon和彩色icon）配置
// 3、事件中心配置

function App() {

  const Home = lazy(() => import('@/pages/home/home.tsx'))

  const urlParams = new URLSearchParams(window.location.search);
  const locale = urlParams.get('locale');
  useEffect(() => {
    if (locale) {
      loadLanguageAsync(locale);
    }
  }, [locale]);



  const { themeType } = useAppStore();
  const [antdLocale, setAntdLocale] = useState<any>(zhCN); // 默认使用中文

  // const { themeToken, colorToken, sizeToken, textStylesToken } = themeStore;
  const { colorToken, sizeToken, textStylesToken } = themeStore;


  // 自定义Ant Design的语言包，去掉预览文字
  const customAntdLocale = {
    ...antdLocale,
    Image: {
      preview: '',  // 设置为空字符串，去掉“预览”字样
    },
  };


  return (
    // 在React Router v6中，所有的路由组件（如Routes、Route）都必须被包裹在BrowserRouter组件中，这是路由系统正常工作的必要条件。

    // 包裹在I18nextProvider中，使i18n实例在整个应用中可用, 使它们可以使用useTranslation
    <I18nextProvider i18n={i18n}>
      <ConfigProvider
        theme={{
          token: {
            ...colorToken, // 组件的主题
            // ...textStylesToken
          },
        }}
        locale={customAntdLocale} // 自定义Ant Design的语言包
      >
        {/* 自定义主题组件 */}
        {/* <ThemeProvider appearance={themeType === 'dark' ? 'dark' : 'light'} customToken={themeType === 'dark' ? dark : light}> */}
        <ThemeProvider>
          <div className="App">
            <BrowserRouter>
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="*" element={<Navigate to="/" />} />
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </div>
        </ThemeProvider>
      </ConfigProvider>
    </I18nextProvider>
  )
}

export default App
