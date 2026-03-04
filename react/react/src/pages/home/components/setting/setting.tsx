import React, { useState, useEffect } from "react";
import { Button, Card, Input, Select, Avatar, Upload, message, Spin, Modal, Form } from 'antd';
import { UserOutlined, EditOutlined, LockOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import useStyles from './style/index.ts';
import { authApi, type User } from '@/api';
import type { UploadFile, UploadProps } from 'antd/es/upload';
import userInfoStore from "@/stores/userInfo.ts";
import { useTranslation } from "@/i18n/index.ts";

const { TextArea } = Input;

const Setting: React.FC = () => {
    const { styles } = useStyles();
    const { t } = useTranslation();
    
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [form] = Form.useForm();
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [passwordForm] = Form.useForm();

    // 获取用户信息
    const fetchUserInfo = async () => {
        setLoading(true);
        try {
            const response = await authApi.getCurrentUser();
            const userData = response as any;
            setUser(userData.user);
            form.setFieldsValue({
                nickname: userData.user.nickname,
                bio: userData.user.bio,
                language: userData.user.language,
                theme: userData.user.theme
            });
        } catch (error: any) {
            message.error(error.response?.data?.error || t('获取用户信息失败'));
        } finally {
            setLoading(false);
        }
    };

    // 初始加载
    useEffect(() => {
        fetchUserInfo();
    }, []);

    // 保存用户信息
    const handleSaveUserInfo = async (values: any) => {
        setLoading(true);
        try {
            await authApi.updateUser(values);
            message.success('保存成功');
            setEditing(false);
            fetchUserInfo();
        } catch (error: any) {
            message.error(error.response?.data?.error || t('保存失败'));
        } finally {
            setLoading(false);
        }
    };

    // 修改密码
    const handleChangePassword = async (values: any) => {
        setLoading(true);
        try {
            await authApi.changePassword({
                old_password: values.oldPassword,
                new_password: values.newPassword
            });
            message.success(t('密码修改成功'));
            setPasswordModalVisible(false);
            passwordForm.resetFields();
        } catch (error: any) {
            message.error(error.response?.data?.error || t('密码修改失败'));
        } finally {
            setLoading(false);
        }
    };

    // 上传前校验
    const beforeUpload = (file: File) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error(t('只能上传图片文件！'));
            return Upload.LIST_IGNORE;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error(t('图片大小不能超过 2MB！'));
            return Upload.LIST_IGNORE;
        }
        return true;
    };

    // 自定义上传头像
    const handleAvatarUpload = async (options: any) => {
        const { file, onSuccess, onError } = options;
        
        try {
            setLoading(true);
            // 将图片转为 Base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64Url = reader.result as string;
                try {
                    // 调用更新用户接口保存头像
                    await authApi.updateUser({ avatar: base64Url });
                    message.success(t('头像上传成功'));
                    setUser({ ...user!, avatar: base64Url });
                    userInfoStore.setUserInfo({
                        id: user?.id.toString() as any,
                        name: user?.nickname || user?.username as any,
                        avatar: base64Url,
                        email: user?.email as any,
                        phone: '',
                        role: 'user'
                    })
                    onSuccess?.('ok');
                } catch (error: any) {
                    message.error(error.response?.data?.error || t('头像上传失败'));
                    onError?.(error);
                } finally {
                    setLoading(false);
                }
            };
            reader.onerror = (error) => {
                message.error(t('图片读取失败'));
                onError?.(error);
                setLoading(false);
            };
        } catch (error: any) {
            message.error(t('头像上传失败'));
            onError?.(error);
            setLoading(false);
        }
    };

    if (loading && !user) {
        return (
            <div className={styles.settingContainer}>
                <div className={styles.header}>{t("个人设置")}</div>
                <div className={styles.content}>
                    <div className={styles.loadingContainer}>
                        <Spin size="large" />
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={styles.settingContainer}>
                <div className={styles.header}>{t("个人设置")}</div>
                <div className={styles.content}>
                    <div className={styles.loadingContainer}>
                        <p>{t("获取用户信息失败")}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.settingContainer}>
            <div className={styles.header}>{t("个人设置")}</div>
            
            <div className={styles.content}>
                {/* 个人信息卡片 */}
                <Card className={styles.card}>
                    <div className={styles.cardHeader}>{t("个人信息")}</div>
                    <div className={styles.cardBody}>
                        <div className={styles.userInfoSection}>
                            {/* 头像 */}
                            <div className={styles.avatarContainer}>
                                <Avatar 
                                    size={120} 
                                    src={user.avatar} 
                                    icon={<UserOutlined />}
                                    className={styles.avatar}
                                />
                                {editing && (
                                    <div className={styles.avatarUpload}>
                                        <Upload
                                            name="avatar"
                                            accept="image/*"
                                            showUploadList={false}
                                            beforeUpload={beforeUpload}
                                            customRequest={handleAvatarUpload}
                                        >
                                            <Button icon={<UploadOutlined />}>{t("点击上传头像")}</Button>
                                        </Upload>
                                        <p className="ant-upload-hint" style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
                                            {t("支持 JPG、PNG 等格式，最大 2MB")}
                                        </p>
                                    </div>
                                )}
                            </div>
                            
                            {/* 编辑表单 */}
                            <Form
                                form={form}
                                onFinish={handleSaveUserInfo}
                                className={styles.editForm}
                            >
                                <div className={styles.infoGrid}>
                                    <div className={styles.infoItem}>
                                        <div className={styles.label}>{t("账号ID")}</div>
                                        <div className={styles.value}>{user.id}</div>
                                    </div>
                                    
                                    <div className={styles.infoItem}>
                                        <div className={styles.label}>{t("用户名")}</div>
                                        <div className={styles.value}>{user.username}</div>
                                    </div>
                                    
                                    <div className={styles.infoItem}>
                                        <div className={styles.label}>{t("邮箱")}</div>
                                        <div className={styles.value}>{user.email}</div>
                                    </div>
                                    
                                    <div className={styles.infoItem}>
                                        <div className={styles.label}>{t("昵称")}</div>
                                        {editing ? (
                                            <Form.Item name="nickname" noStyle>
                                                <Input className={styles.input} placeholder={t("请输入昵称")} />
                                            </Form.Item>
                                        ) : (
                                            <div className={styles.value}>{user.nickname || t('未设置')}</div>
                                        )}
                                    </div>
                                    
                                    <div className={styles.infoItem}>
                                        <div className={styles.label}>{t("个人简介")}</div>
                                        {editing ? (
                                            <Form.Item name="bio" noStyle>
                                                <TextArea className={styles.textArea} placeholder={t("请输入个人简介")} />
                                            </Form.Item>
                                        ) : (
                                            <div className={styles.value}>{user.bio || t('未设置')}</div>
                                        )}
                                    </div>
                                </div>
                            </Form>
                            
                            {/* 语言和主题设置 */}
                            <div className={styles.infoGrid}>
                                {/* <div className={styles.infoItem}>
                                    <div className={styles.label}>语言设置</div>
                                    {editing ? (
                                        <Form.Item name="language" noStyle>
                                            <Select className={styles.select}>
                                                <Option value="zh-CN">中文</Option>
                                                <Option value="en-US">English</Option>
                                            </Select>
                                        </Form.Item>
                                    ) : (
                                        <div className={styles.value}>{user.language === 'zh-CN' ? '中文' : 'English'}</div>
                                    )}
                                </div> */}
                                
                                {/* <div className={styles.infoItem}>
                                    <div className={styles.label}>主题偏好</div>
                                    {editing ? (
                                        <Form.Item name="theme" noStyle>
                                            <Select className={styles.select}>
                                                <Option value="light">亮色</Option>
                                                <Option value="dark">暗色</Option>
                                            </Select>
                                        </Form.Item>
                                    ) : (
                                        <div className={styles.value}>{user.theme === 'light' ? '亮色' : '暗色'}</div>
                                    )}
                                </div> */}
                            </div>
                            
                            {/* 操作按钮 */}
                            <div className={styles.buttonGroup}>
                                {editing ? (
                                    <>
                                        <Button 
                                            type="primary" 
                                            icon={<SaveOutlined />}
                                            onClick={() => form.submit()}
                                            loading={loading}
                                        >
                                            {t("保存")}
                                        </Button>
                                        <Button 
                                            onClick={() => {
                                                setEditing(false);
                                                form.setFieldsValue({
                                                    nickname: user.nickname,
                                                    bio: user.bio,
                                                    language: user.language,
                                                    theme: user.theme
                                                });
                                            }}
                                        >
                                            {t("取消")}
                                        </Button>
                                    </>
                                ) : (
                                    <Button 
                                        type="primary" 
                                        icon={<EditOutlined />}
                                        onClick={() => setEditing(true)}
                                    >
                                        {t("修改信息")}
                                    </Button>
                                )}
                                <Button 
                                    icon={<LockOutlined />}
                                    onClick={() => setPasswordModalVisible(true)}
                                >
                                    {t("修改密码")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            
            {/* 密码修改模态框 */}
            <Modal
                title={t("修改密码")}
                open={passwordModalVisible}
                onCancel={() => setPasswordModalVisible(false)}
                footer={null}
                className={styles.modalContent}
            >
                <Form
                    form={passwordForm}
                    onFinish={handleChangePassword}
                    layout="vertical"
                    className={styles.modalForm}
                >
                    <Form.Item
                        name="oldPassword"
                        label={t("旧密码")}
                        rules={[{ required: true, message: t('请输入旧密码') }]}
                    >
                        <Input.Password placeholder={t("请输入旧密码")} />
                    </Form.Item>
                    <Form.Item
                        name="newPassword"
                        label={t("新密码")}
                        rules={[{ required: true, message: t('请输入新密码') }]}
                    >
                        <Input.Password placeholder={t("请输入新密码")} />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label={t("确认新密码")}
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: t('请确认新密码') },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(t('两次输入的密码不一致')));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder={t("请确认新密码")} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }} loading={loading}>
                            {t("确认修改")}
                        </Button>
                        <Button onClick={() => setPasswordModalVisible(false)}>
                            {t("取消")}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            
        </div>
    );
};

export default Setting