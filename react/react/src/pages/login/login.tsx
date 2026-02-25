import React, { useState } from 'react';
import { Input, Button, Card, message, Tabs } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { authApi } from '@/api';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTag, setAtiveTag] = useState<string>('login')
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!loginUsername || !loginPassword) {
      message.error('请输入用户名和密码');
      return;
    }

    setLoading(true);
    try {
      const response: any = await authApi.login({ username: loginUsername, password: loginPassword });
      localStorage.setItem('token', response?.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      message.success('登录成功');
      navigate('/home');
    } catch (error: any) {
      message.error(error.response?.data?.error || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!registerUsername || !registerEmail || !registerPassword) {
      message.error('请输入用户名、邮箱和密码');
      return;
    }

    setLoading(true);
    try {
      await authApi.register({ username: registerUsername, email: registerEmail, password: registerPassword });
      message.success('注册成功，请登录');
      setAtiveTag('login');
      setRegisterUsername('');
      setRegisterEmail('');
      setRegisterPassword('');
    } catch (error: any) {
      message.error(error.response?.data?.error || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeTag = (e: any) => {
    setAtiveTag(e)
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: 400 }}>
        <Tabs
          activeKey={activeTag}
          onTabClick={(e) => handleChangeTag(e)}
          items={[
            {
              key: 'login',
              label: '登录',
              children: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="用户名" 
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    style={{ marginBottom: 16 }}
                  />
                  <Input.Password 
                    prefix={<LockOutlined />} 
                    placeholder="密码" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    style={{ marginBottom: 16 }}
                  />
                  <Button 
                    type="primary" 
                    onClick={handleLogin} 
                    block
                    loading={loading}
                  >
                    登录
                  </Button>
                </div>
              ),
            },
            {
              key: 'register',
              label: '注册',
              children: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="用户名" 
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    style={{ marginBottom: 16 }}
                  />
                  <Input 
                    prefix={<MailOutlined />} 
                    placeholder="邮箱" 
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    style={{ marginBottom: 16 }}
                  />
                  <Input.Password 
                    prefix={<LockOutlined />} 
                    placeholder="密码" 
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    style={{ marginBottom: 16 }}
                  />
                  <Button 
                    type="primary" 
                    onClick={handleRegister} 
                    block
                    loading={loading}
                  >
                    注册
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default Login;