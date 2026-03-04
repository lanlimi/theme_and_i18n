import React, { useState, useEffect } from "react";
import { Button, Input, List, Card, Modal, message, Spin, Pagination } from 'antd';
import { SearchOutlined, CalendarOutlined } from '@ant-design/icons';
import useStyles from './style/index.ts';
import { scheduleTemplateApi, type ScheduleTemplate, type TemplateSchedule } from '@/api';
import { useTranslation } from "@/i18n/index.ts";

const ScheduleSubscribe: React.FC = () => {
    const { styles } = useStyles();
    const { t } = useTranslation();
    
    const [templates, setTemplates] = useState<ScheduleTemplate[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [selectedTemplate, setSelectedTemplate] = useState<ScheduleTemplate | null>(null);
    const [templateSchedules, setTemplateSchedules] = useState<TemplateSchedule[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    // 获取模板列表
    const fetchTemplates = async (page: number = currentPage) => {
        setLoading(true);
        try {
            const response = await scheduleTemplateApi.getScheduleTemplates({
                title: searchText || undefined,
                page: page,
                per_page: pageSize
            });
            const data = response as any;
            setTemplates(data.templates);
            setTotal(data.total);
        } catch (error: any) {
            message.error(error.response?.data?.error || t('获取模板失败'));
        } finally {
            setLoading(false);
        }
    };

    // 初始加载
    useEffect(() => {
        fetchTemplates();
    }, []);

    // 搜索模板
    const handleSearch = () => {
        setCurrentPage(1);
        fetchTemplates(1);
    };

    // 查看模板详情
    const handleViewTemplate = async (template: ScheduleTemplate) => {
        setLoading(true);
        try {
            const response = await scheduleTemplateApi.getScheduleTemplate(template.id);
            const data = response as any;
            setSelectedTemplate(data.template);
            setTemplateSchedules(data.schedules);
            setModalVisible(true);
        } catch (error: any) {
            message.error(error.response?.data?.error || t('获取模板详情失败'));
        } finally {
            setLoading(false);
        }
    };

    // 订阅模板
    const handleSubscribe = async () => {
        if (!selectedTemplate) return;
        
        setLoading(true);
        try {
            await scheduleTemplateApi.subscribeScheduleTemplate(selectedTemplate.id);
            message.success(`${t("成功订阅模板")} "${selectedTemplate.title}"`);
            setModalVisible(false);
        } catch (error: any) {
            message.error(error.response?.data?.error || t('订阅失败'));
        } finally {
            setLoading(false);
        }
    };

    // 分页变化处理
    const handlePageChange = (page: number, pageSize: number) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        fetchTemplates(page);
    };

    return (
        <div className={styles.subscribeContainer}>
            {/* 搜索区 */}
            <div className={styles.searchArea}>
                <Input 
                    className={styles.searchInput}
                    placeholder={t("输入模板标题搜索")}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    prefix={<SearchOutlined />}
                    onPressEnter={handleSearch}
                />
                <Button 
                    type="primary" 
                    icon={<SearchOutlined />}
                    onClick={handleSearch}
                >
                    {t("搜索")}
                </Button>
            </div>

            {/* 内容展示区 */}
            <div className={styles.contentArea}>
                {loading && !modalVisible ? (
                    <div className={styles.loadingContainer}>
                        <Spin size="large" />
                    </div>
                ) : templates.length === 0 ? (
                    <div className={styles.emptyContainer}>
                        <p>{t("暂无日程模板")}</p>
                    </div>
                ) : (
                    <>
                        <List
                            dataSource={templates}
                            renderItem={(template) => (
                                <Card 
                                    className={styles.templateCard}
                                    hoverable
                                    actions={[
                                        <Button 
                                            type="primary" 
                                            onClick={() => handleViewTemplate(template)}
                                            icon={<CalendarOutlined />}
                                        >
                                            {t("查看详情")}
                                        </Button>
                                    ]}
                                >
                                    <div className={styles.templateHeader}>
                                        <h3 className={styles.templateTitle}>{template.title}</h3>
                                    </div>
                                    {template.description && (
                                        <div className={styles.templateDescription}>
                                            {template.description}
                                        </div>
                                    )}
                                    <div className={styles.templateFooter}>
                                        <div className={styles.templateMeta}>
                                            {t("创建时间：")}{new Date(template.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                </Card>
                            )}
                        />
                        <div className={styles.paginationContainer}>
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={total}
                                onChange={handlePageChange}
                                showSizeChanger
                                showQuickJumper
                                showTotal={(total) => `${t("共")} ${total} ${t("条")}`}
                                pageSizeOptions={['10', '20', '50', '100']}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* 模板详情模态框 */}
            <Modal
                title={selectedTemplate?.title || t("模板详情")}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setModalVisible(false)}>
                        {t("取消")}
                    </Button>,
                    <Button 
                        key="subscribe" 
                        type="primary" 
                        loading={loading}
                        onClick={handleSubscribe}
                    >
                        {t("订阅此模板")}
                    </Button>
                ]}
                width={800}
            >
                {loading ? (
                    <div className={styles.loadingContainer}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <>
                        {selectedTemplate?.description && (
                            <div className={styles.templateDescription}>
                                {selectedTemplate.description}
                            </div>
                        )}
                        <div style={{ marginTop: 24 }}>
                            <h4>{t("日程列表")}</h4>
                            {templateSchedules.length === 0 ? (
                                <p style={{ color: '#999', marginTop: 12 }}>{t("暂无日程")}</p>
                            ) : (
                                <List
                                    dataSource={templateSchedules}
                                    renderItem={(schedule) => (
                                        <div className={styles.scheduleItem}>
                                            <div className={styles.scheduleTitle}>{schedule.title}</div>
                                            <div className={styles.scheduleDetails}>
                                                <span className={styles.timeInfo}>
                                                    {new Date(schedule.start_time).toLocaleString()} - {new Date(schedule.end_time).toLocaleString()}
                                                </span>
                                                <span className={`${styles.priorityBadge} ${styles[`priority${schedule.priority.charAt(0).toUpperCase() + schedule.priority.slice(1)}`]}`}>
                                                    {schedule.priority === 'high' ? t('高') : schedule.priority === 'medium' ? t('中') : t('低')}{t("优先级")}
                                                </span>
                                                <span className={`${styles.statusBadge} ${styles[`status${schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}`]}`}>
                                                    {schedule.status === 'pending' ? t('待处理') : schedule.status === 'in_progress' ? t('进行中') : t('已完成')}
                                                </span>
                                            </div>
                                            {schedule.description && (
                                                <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                                                    {schedule.description}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                />
                            )}
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default ScheduleSubscribe