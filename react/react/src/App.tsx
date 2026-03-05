import { lazy, Suspense, useEffect, useState } from 'react'
import './App.css'
import { Route, Routes, Navigate, BrowserRouter, useLocation, useNavigate } from "react-router-dom";
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from 'antd-style';
import { ConfigProvider, message } from 'antd';
import i18n from "i18next";
import themeStore from './stores/theme';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import { useAppStore } from './stores';
import light from './config/light.json'
import dark from './config/dark.json'
import loadLanguageAsync from './locales/locales';
import appStore from './stores/appStore';
import { debounce } from 'lodash-es';
import { observer } from 'mobx-react-lite';
import userInfoStore from './stores/userInfo';
import { getBrowserLang } from './utils/getBrowserLang';

// 1、优先完成国际化配置
// 2、阿里icon组件（可变色icon和彩色icon）配置
// 3、事件中心配置

function App() {

  const Home = lazy(() => import('@/pages/home/home.tsx'))
  const Login = lazy(() => import('@/pages/login/login.tsx'))


  const currentLocation  = window.location.href.split('?')
  const language: any = localStorage.getItem('i18n_Language');

  useEffect(() => {
    if (language) {
      loadLanguageAsync(language);
    }
    else if (currentLocation && currentLocation[1]?.includes('locale')) {
      const debuggerLan = currentLocation[1].split('=')[1]
      loadLanguageAsync(debuggerLan);
    }
    else {
      const browserLanguage = getBrowserLang()
      loadLanguageAsync(browserLanguage);
    }
    
    console.log('url参数', currentLocation)
    console.log('浏览器语言', language)
  }, []);






  const { themeType } = useAppStore();
  const [antdLocale, setAntdLocale] = useState<any>(zhCN); // 默认使用中文

  // const { themeToken, colorToken, sizeToken, textStylesToken } = themeStore;
  const { themeToken, colorToken, sizeToken, textStylesToken } = themeStore;

    // 组件挂载时立即应用正确的主题和语言, 并配置全局message
  useEffect(() => {
    // 检查本地存储中的主题设置
    const savedTheme: any = localStorage.getItem('themeType');
    if (savedTheme) {
      appStore.setThemeType(savedTheme);
      // 如果是自动模式，根据系统主题设置
      if (savedTheme === 'auto') {
        // 获取当前系统主题
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        themeStore.setTheme(isDark ? 'dark' : 'light');
      } else {
        // 手动选择的主题，直接设置
        themeStore.setTheme(savedTheme === 'dark' ? 'dark' : 'light');
      }
    }



    const userStore = localStorage.getItem('user');
    if (userStore) {
      const userInfo = JSON.parse(userStore)
      // 将用户信息存储到userInfoStore
      userInfoStore.setUserInfo({
        id: userInfo.id.toString(),
        name: userInfo.nickname || userInfo.username,
        avatar: userInfo.avatar || '',
        email: userInfo.email,
        phone: '',
        role: 'user'
      });
    }


    // // 配置全局message
    // message.config({
    //   top: 80,
    //   duration: 4,
    //   maxCount: 3,
    //   prefixCls:'',
    //   rtl: false,
    // });

    // handleLanguageChange()
  }, []);


    // 监听缩放
  useEffect(() => {
    const handleResize = debounce(() => {
      // console.log('当前窗口尺寸大小', window.innerWidth);
      themeStore.setSize(window.innerWidth);
    }, 200);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


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
            ...themeToken.token as any, // 组件的主题
            // ...colorToken, // 组件的主题
            // ...sizeToken, // 组件的尺寸
            ...textStylesToken
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
                  <Route path="/login" element={<Login />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </div>
        </ThemeProvider>
      </ConfigProvider>
    </I18nextProvider>
  )
}

export default observer(App)
