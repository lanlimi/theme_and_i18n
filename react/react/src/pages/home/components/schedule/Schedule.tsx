
import React, { useState, useEffect } from "react";
import { Button, Input, List, Card, Modal, Form, Select, message, Spin, DatePicker, Pagination, Checkbox } from 'antd';
import type { InputRef } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
const { TextArea } = Input;
const { RangePicker } = DatePicker;
import { PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import useStyles from './style/index.ts';
import { scheduleApi, type Schedule, type CreateScheduleRequest, type UpdateScheduleRequest } from '@/api';

const { Option } = Select;


const ScheduleManage: React.FC = () => {
    const { styles } = useStyles();
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedSchedules, setSelectedSchedules] = useState<number[]>([]);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
    const [form] = Form.useForm();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [isAllSelected, setIsAllSelected] = useState(false);

    // 获取日程列表
    const fetchSchedules = async (page: number = currentPage) => {
        setLoading(true);
        try {
            const response = await scheduleApi.getSchedules({
                title: searchText || undefined,
                page: page,
                per_page: pageSize
            });
            const data = response as any;
            setSchedules(data.schedules);
            setTotal(data.total);
            setSelectedSchedules([]);
            setIsAllSelected(false);
        } catch (error: any) {
            message.error(error.response?.data?.error || '获取日程失败');
        } finally {
            setLoading(false);
        }
    };

    // 初始加载
    useEffect(() => {
        fetchSchedules();
    }, []);

    // 搜索日程
    const handleSearch = () => {
        setCurrentPage(1);
        setSelectedSchedules([]);
        setIsAllSelected(false);
        fetchSchedules(1);
    };

    // 创建日程
    const handleCreate = async (values: any) => {
        try {
            const { timeRange, ...rest } = values;
            const createData: CreateScheduleRequest = {
                ...rest,
                start_time: timeRange[0].toISOString(),
                end_time: timeRange[1].toISOString()
            };
            await scheduleApi.createSchedule(createData);
            message.success('创建日程成功');
            setIsCreateModalVisible(false);
            form.resetFields();
            fetchSchedules(currentPage);
        } catch (error: any) {
            message.error(error.response?.data?.error || '创建日程失败');
        }
    };

    // 更新日程
    const handleUpdate = async (values: any) => {
        if (!editingSchedule) return;
        
        try {
            const { timeRange, ...rest } = values;
            const updateData: UpdateScheduleRequest = {
                ...rest,
                start_time: timeRange[0].toISOString(),
                end_time: timeRange[1].toISOString()
            };
            await scheduleApi.updateSchedule(editingSchedule.id, updateData);
            message.success('更新日程成功');
            setIsEditModalVisible(false);
            setEditingSchedule(null);
            form.resetFields();
            fetchSchedules(currentPage);
        } catch (error: any) {
            message.error(error.response?.data?.error || '更新日程失败');
        }
    };

    // 删除日程
    const handleDelete = async () => {
        if (selectedSchedules.length === 0) {
            message.warning('请选择要删除的日程');
            return;
        }

        try {
            for (const id of selectedSchedules) {
                await scheduleApi.deleteSchedule(id);
            }
            message.success(`删除了 ${selectedSchedules.length} 个日程`);
            setSelectedSchedules([]);
            setIsAllSelected(false);
            if (schedules.length - selectedSchedules.length === 0 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
                fetchSchedules(currentPage - 1);
            } else {
                fetchSchedules(currentPage);
            }
        } catch (error: any) {
            message.error(error.response?.data?.error || '删除日程失败');
        }
    };

    // 编辑日程
    const handleEdit = (schedule: Schedule) => {
        setEditingSchedule(schedule);
        form.setFieldsValue({
            title: schedule.title,
            description: schedule.description,
            timeRange: [dayjs(schedule.start_time), dayjs(schedule.end_time)],
            priority: schedule.priority,
            status: schedule.status
        });
        setIsEditModalVisible(true);
    };

    // 切换选择状态
    const toggleSelect = (id: number) => {
        if (selectedSchedules.includes(id)) {
            const newSelected = selectedSchedules.filter(item => item !== id);
            setSelectedSchedules(newSelected);
            setIsAllSelected(false);
        } else {
            const newSelected = [...selectedSchedules, id];
            setSelectedSchedules(newSelected);
            if (newSelected.length === schedules.length) {
                setIsAllSelected(true);
            }
        }
    };

    // 全选/取消全选
    const handleSelectAll = (checked: boolean) => {
        setIsAllSelected(checked);
        if (checked) {
            setSelectedSchedules(schedules.map(schedule => schedule.id));
        } else {
            setSelectedSchedules([]);
        }
    };

    // 分页变化处理
    const handlePageChange = (page: number, pageSize: number) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        setSelectedSchedules([]);
        setIsAllSelected(false);
        fetchSchedules(page);
    };

    return (
        <div className={styles.scheduleContainer}>
            {/* 操作区 */}
            <div className={styles.operationArea}>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => setIsCreateModalVisible(true)}
                >
                    创建日程
                </Button>
                <Button 
                    danger 
                    icon={<DeleteOutlined />}
                    onClick={handleDelete}
                    disabled={selectedSchedules.length === 0}
                >
                    删除日程 ({selectedSchedules.length})
                </Button>
                <Checkbox 
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    disabled={schedules.length === 0}
                >
                    全选日程
                </Checkbox>
                <div className={styles.searchArea}>
                    <Input 
                        placeholder="输入日程标题搜索" 
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 300, marginRight: 8 }}
                    />
                    <Button 
                        icon={<SearchOutlined />}
                        onClick={handleSearch}
                    >
                        查询
                    </Button>
                </div>
            </div>

            {/* 内容展示区 */}
            <div className={styles.contentArea}>
                {loading ? (
                    <div className={styles.loadingContainer}>
                        <Spin size="large" />
                    </div>
                ) : schedules.length === 0 ? (
                    <div className={styles.emptyContainer}>
                        <p>暂无日程</p>
                    </div>
                ) : (
                    <>
                        <List
                            dataSource={schedules}
                            renderItem={(schedule) => (
                                <Card 
                                    className={styles.scheduleItem}
                                    hoverable
                                >
                                    <div className={styles.scheduleContent}>
                                        <div 
                                            className={styles.checkbox}
                                            onClick={() => toggleSelect(schedule.id)}
                                        >
                                            {selectedSchedules.includes(schedule.id) ? '✓' : ''}
                                        </div>
                                        <div className={styles.scheduleInfo}>
                                            <div className={styles.scheduleTitle}>
                                                {schedule.title}
                                                <Button 
                                                    type="link" 
                                                    icon={<EditOutlined />}
                                                    onClick={() => handleEdit(schedule)}
                                                    className={styles.editButton}
                                                />
                                            </div>
                                            <div className={styles.scheduleDetails}>
                                                <span className={styles.timeInfo}>
                                                    {new Date(schedule.start_time).toLocaleString()} - {new Date(schedule.end_time).toLocaleString()}
                                                </span>
                                                <span className={`${styles.priorityBadge} ${styles[`priority${schedule.priority.charAt(0).toUpperCase() + schedule.priority.slice(1)}`]}`}>
                                                    {schedule.priority === 'high' ? '高' : schedule.priority === 'medium' ? '中' : '低'}优先级
                                                </span>
                                                <span className={`${styles.statusBadge} ${styles[`status${schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}`]}`}>
                                                    {schedule.status === 'pending' ? '待处理' : schedule.status === 'in_progress' ? '进行中' : '已完成'}
                                                </span>
                                            </div>
                                            {schedule.description && (
                                                <div className={styles.scheduleDescription}>
                                                    {schedule.description}
                                                </div>
                                            )}
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
                                showTotal={(total) => `共 ${total} 条`}
                                pageSizeOptions={['10', '20', '50', '100']}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* 创建日程模态框 */}
            <Modal
                title="创建日程"
                open={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={handleCreate}
                    layout="vertical"
                >
                    <Form.Item
                        name="title"
                        label="标题"
                        rules={[{ required: true, message: '请输入标题' }]}
                    >
                        <Input placeholder="请输入日程标题" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="描述"
                    >
                        <TextArea placeholder="请输入日程描述" rows={3} />
                    </Form.Item>
                    <Form.Item
                        name="timeRange"
                        label="时间范围"
                        rules={[{ required: true, message: '请选择时间范围' }]}
                    >
                        <RangePicker 
                            showTime 
                            format="YYYY-MM-DD HH:mm:ss"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="priority"
                        label="优先级"
                        initialValue="medium"
                    >
                        <Select>
                            <Option value="high">高</Option>
                            <Option value="medium">中</Option>
                            <Option value="low">低</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="状态"
                        initialValue="pending"
                    >
                        <Select>
                            <Option value="pending">待处理</Option>
                            <Option value="in_progress">进行中</Option>
                            <Option value="completed">已完成</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                            确定
                        </Button>
                        <Button onClick={() => setIsCreateModalVisible(false)}>
                            取消
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* 编辑日程模态框 */}
            <Modal
                title="编辑日程"
                open={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={handleUpdate}
                    layout="vertical"
                >
                    <Form.Item
                        name="title"
                        label="标题"
                        rules={[{ required: true, message: '请输入标题' }]}
                    >
                        <Input placeholder="请输入日程标题" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="描述"
                    >
                        <TextArea placeholder="请输入日程描述" rows={3} />
                    </Form.Item>
                    <Form.Item
                        name="timeRange"
                        label="时间范围"
                        rules={[{ required: true, message: '请选择时间范围' }]}
                    >
                        <RangePicker 
                            showTime 
                            format="YYYY-MM-DD HH:mm:ss"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="priority"
                        label="优先级"
                    >
                        <Select>
                            <Option value="high">高</Option>
                            <Option value="medium">中</Option>
                            <Option value="low">低</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="状态"
                    >
                        <Select>
                            <Option value="pending">待处理</Option>
                            <Option value="in_progress">进行中</Option>
                            <Option value="completed">已完成</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                            确定
                        </Button>
                        <Button onClick={() => setIsEditModalVisible(false)}>
                            取消
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ScheduleManage