import { lazy, Suspense, useState } from 'react'
import './App.css'
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";

// 1、优先完成国际化配置
// 2、阿里icon组件（可变色icon和彩色icon）配置
// 3、事件中心配置

function App() {

  const Home = lazy(() => import('@/pages/home/home.tsx'))

  return (
    // 在React Router v6中，所有的路由组件（如Routes、Route）都必须被包裹在BrowserRouter组件中，这是路由系统正常工作的必要条件。
    <BrowserRouter>
      <div className='app'>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  )
}

export default App
