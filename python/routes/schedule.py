# d:\theme_and_i18n\theme_and_i18n\python\routes\schedule.py
"""
日程管理模块

此模块提供日程相关的 RESTful API 接口，包括：
1. 日程的 CRUD 操作（创建、读取、更新、删除）
2. 日程模板的查询与订阅功能
3. 支持分页、过滤、搜索等高级查询功能

所有接口均需 JWT 认证，确保用户只能访问自己的日程数据
"""

from flask import Blueprint, request, jsonify  # 导入 Flask 相关模块
from models import Schedule, ScheduleTemplate, TemplateSchedule, db  # 导入数据模型
from utils.auth import token_required  # 导入认证装饰器
from datetime import datetime  # 导入日期时间处理模块

# 创建 Blueprint，用于组织相关的路由
schedule_bp = Blueprint('schedule', __name__)


@schedule_bp.route('/schedules', methods=['GET'])
@token_required
def get_schedules(user_id):
    """
    获取日程列表
    
    Args:
        user_id: 从认证装饰器注入的用户 ID
    
    Query 参数:
        page: 页码，默认值 1
        per_page: 每页数量，默认值 10
        status: 状态过滤（pending/in_progress/completed）
        priority: 优先级过滤（high/medium/low）
        title: 标题模糊查询
    
    Returns:
        JSON: 包含日程列表、总数、页数、当前页的响应
    
    状态码:
        200: 成功
    """
    # 从请求参数中获取分页和过滤条件
    page = request.args.get('page', 1, type=int)  # 页码，默认 1
    per_page = request.args.get('per_page', 10, type=int)  # 每页数量，默认 10
    status = request.args.get('status')  # 状态过滤
    priority = request.args.get('priority')  # 优先级过滤
    title = request.args.get('title')  # 标题模糊查询
    
    # 构建查询对象，只查询当前用户的日程
    query = Schedule.query.filter_by(user_id=user_id)
    
    # 标题模糊查询
    if title:
        query = query.filter(Schedule.title.like(f'%{title}%'))
    
    # 状态过滤
    if status:
        query = query.filter_by(status=status)
    
    # 优先级过滤
    if priority:
        query = query.filter_by(priority=priority)
    
    # 按开始时间降序排序（最新的在前）
    query = query.order_by(Schedule.start_time.desc())
    
    # 执行分页查询
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    # 返回 JSON 响应
    return jsonify({
        'schedules': [schedule.to_dict() for schedule in pagination.items],  # 日程列表
        'total': pagination.total,  # 总记录数
        'pages': pagination.pages,  # 总页数
        'current_page': page  # 当前页码
    }), 200


@schedule_bp.route('/schedules/<int:schedule_id>', methods=['GET'])
@token_required
def get_schedule(user_id, schedule_id):
    """
    获取单个日程详情
    
    Args:
        user_id: 从认证装饰器注入的用户 ID
        schedule_id: 路径参数，日程 ID
    
    Returns:
        JSON: 包含日程详情的响应
    
    状态码:
        200: 成功
        404: 日程不存在
    """
    # 查询指定 ID 和用户的日程
    schedule = Schedule.query.filter_by(id=schedule_id, user_id=user_id).first()
    
    # 检查日程是否存在
    if not schedule:
        return jsonify({'error': 'Schedule not found'}), 404
    
    # 返回日程详情
    return jsonify({'schedule': schedule.to_dict()}), 200


@schedule_bp.route('/schedules', methods=['POST'])
@token_required
def create_schedule(user_id):
    """
    创建新日程
    
    Args:
        user_id: 从认证装饰器注入的用户 ID
    
    Request JSON:
        title: 日程标题（必填）
        description: 日程描述（可选，默认空字符串）
        start_time: 开始时间（必填，ISO 格式）
        end_time: 结束时间（必填，ISO 格式）
        priority: 优先级（可选，默认 medium）
        status: 状态（可选，默认 pending）
    
    Returns:
        JSON: 包含创建成功信息和日程详情的响应
    
    状态码:
        201: 创建成功
        400: 请求参数错误
    """
    # 获取请求体 JSON 数据
    data = request.get_json()
    
    # 提取参数，设置默认值
    title = data.get('title')
    description = data.get('description', '')  # 默认空字符串
    start_time = data.get('start_time')
    end_time = data.get('end_time')
    priority = data.get('priority', 'medium')  # 默认 medium
    status = data.get('status', 'pending')  # 默认 pending
    
    # 校验必填字段
    if not title or not start_time or not end_time:
        return jsonify({'error': 'Missing required fields'}), 400
    
    # 解析时间字符串为 datetime 对象
    try:
        start_time = datetime.fromisoformat(start_time)
        end_time = datetime.fromisoformat(end_time)
    except ValueError:
        return jsonify({'error': 'Invalid datetime format'}), 400
    
    # 创建日程对象
    schedule = Schedule(
        user_id=user_id,  # 当前用户 ID
        title=title,
        description=description,
        start_time=start_time,
        end_time=end_time,
        priority=priority,
        status=status
    )
    
    # 保存到数据库
    db.session.add(schedule)
    db.session.commit()
    
    # 返回创建成功响应
    return jsonify({'message': 'Schedule created successfully', 'schedule': schedule.to_dict()}), 201


@schedule_bp.route('/schedules/<int:schedule_id>', methods=['PUT'])
@token_required
def update_schedule(user_id, schedule_id):
    """
    更新日程
    
    Args:
        user_id: 从认证装饰器注入的用户 ID
        schedule_id: 路径参数，日程 ID
    
    Request JSON:
        title: 日程标题（可选）
        description: 日程描述（可选）
        start_time: 开始时间（可选，ISO 格式）
        end_time: 结束时间（可选，ISO 格式）
        priority: 优先级（可选）
        status: 状态（可选）
    
    Returns:
        JSON: 包含更新成功信息和日程详情的响应
    
    状态码:
        200: 更新成功
        400: 请求参数错误
        404: 日程不存在
    """
    # 查询指定 ID 和用户的日程
    schedule = Schedule.query.filter_by(id=schedule_id, user_id=user_id).first()
    
    # 检查日程是否存在
    if not schedule:
        return jsonify({'error': 'Schedule not found'}), 404
    
    # 获取请求体 JSON 数据
    data = request.get_json()
    
    # 动态更新字段
    if 'title' in data:
        schedule.title = data['title']
    if 'description' in data:
        schedule.description = data['description']
    if 'start_time' in data:
        try:
            schedule.start_time = datetime.fromisoformat(data['start_time'])
        except ValueError:
            return jsonify({'error': 'Invalid datetime format'}), 400
    if 'end_time' in data:
        try:
            schedule.end_time = datetime.fromisoformat(data['end_time'])
        except ValueError:
            return jsonify({'error': 'Invalid datetime format'}), 400
    if 'priority' in data:
        schedule.priority = data['priority']
    if 'status' in data:
        schedule.status = data['status']
    
    # 提交更新
    db.session.commit()
    
    # 返回更新成功响应
    return jsonify({'message': 'Schedule updated successfully', 'schedule': schedule.to_dict()}), 200


@schedule_bp.route('/schedules/<int:schedule_id>', methods=['DELETE'])
@token_required
def delete_schedule(user_id, schedule_id):
    """
    删除日程
    
    Args:
        user_id: 从认证装饰器注入的用户 ID
        schedule_id: 路径参数，日程 ID
    
    Returns:
        JSON: 包含删除成功信息的响应
    
    状态码:
        200: 删除成功
        404: 日程不存在
    """
    # 查询指定 ID 和用户的日程
    schedule = Schedule.query.filter_by(id=schedule_id, user_id=user_id).first()
    
    # 检查日程是否存在
    if not schedule:
        return jsonify({'error': 'Schedule not found'}), 404
    
    # 从数据库中删除
    db.session.delete(schedule)
    db.session.commit()
    
    # 返回删除成功响应
    return jsonify({'message': 'Schedule deleted successfully'}), 200


# 日程模板相关接口
@schedule_bp.route('/schedule-templates', methods=['GET'])
@token_required
def get_schedule_templates(user_id):
    """
    获取日程模板列表
    
    Args:
        user_id: 从认证装饰器注入的用户 ID
    
    Query 参数:
        page: 页码，默认值 1
        per_page: 每页数量，默认值 10
        title: 模板标题模糊查询
    
    Returns:
        JSON: 包含模板列表、总数、页数、当前页的响应
    
    状态码:
        200: 成功
    """
    # 从请求参数中获取分页和搜索条件
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    title = request.args.get('title')
    
    # 构建查询对象（模板对所有用户开放）
    query = ScheduleTemplate.query
    
    # 标题模糊查询
    if title:
        query = query.filter(ScheduleTemplate.title.like(f'%{title}%'))
    
    # 按创建时间降序排序
    query = query.order_by(ScheduleTemplate.created_at.desc())
    
    # 执行分页查询
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    # 返回 JSON 响应
    return jsonify({
        'templates': [template.to_dict() for template in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    }), 200


@schedule_bp.route('/schedule-templates/<int:template_id>', methods=['GET'])
@token_required
def get_schedule_template(user_id, template_id):
    """
    获取日程模板详情
    
    Args:
        user_id: 从认证装饰器注入的用户 ID
        template_id: 路径参数，模板 ID
    
    Returns:
        JSON: 包含模板详情和关联日程的响应
    
    状态码:
        200: 成功
        404: 模板不存在
    """
    # 查询模板
    template = ScheduleTemplate.query.filter_by(id=template_id).first()
    
    # 检查模板是否存在
    if not template:
        return jsonify({'error': 'Template not found'}), 404
    
    # 查询模板关联的日程
    template_schedules = TemplateSchedule.query.filter_by(template_id=template_id).all()
    
    # 返回模板详情
    return jsonify({
        'template': template.to_dict(),
        'schedules': [schedule.to_dict() for schedule in template_schedules]
    }), 200


@schedule_bp.route('/schedule-templates/<int:template_id>/subscribe', methods=['POST'])
@token_required
def subscribe_schedule_template(user_id, template_id):
    """
    订阅日程模板（创建模板中的所有日程）
    
    Args:
        user_id: 从认证装饰器注入的用户 ID
        template_id: 路径参数，模板 ID
    
    Returns:
        JSON: 包含订阅成功信息和创建的日程列表
    
    状态码:
        201: 订阅成功
        400: 模板无日程
        404: 模板不存在
    """
    # 查询模板
    template = ScheduleTemplate.query.filter_by(id=template_id).first()
    
    # 检查模板是否存在
    if not template:
        return jsonify({'error': 'Template not found'}), 404
    
    # 查询模板关联的日程
    template_schedules = TemplateSchedule.query.filter_by(template_id=template_id).all()
    
    # 检查模板是否有日程
    if not template_schedules:
        return jsonify({'error': 'Template has no schedules'}), 400
    
    # 为用户创建日程
    created_schedules = []
    for template_schedule in template_schedules:
        # 创建新的日程，复制模板中的日程信息
        schedule = Schedule(
            user_id=user_id,  # 当前用户 ID
            title=template_schedule.title,
            description=template_schedule.description,
            start_time=template_schedule.start_time,
            end_time=template_schedule.end_time,
            priority=template_schedule.priority,
            status=template_schedule.status
        )
        db.session.add(schedule)
        created_schedules.append(schedule)
    
    # 提交事务
    db.session.commit()
    
    # 返回订阅成功响应
    return jsonify({
        'message': f'Successfully subscribed to template "{template.title}"',
        'created_schedules': [schedule.to_dict() for schedule in created_schedules]
    }), 201