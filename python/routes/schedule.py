# d:\theme_and_i18n\theme_and_i18n\python\routes\schedule.py
from flask import Blueprint, request, jsonify
from models import Schedule, ScheduleTemplate, TemplateSchedule, db
from utils.auth import token_required
from datetime import datetime

schedule_bp = Blueprint('schedule', __name__)

@schedule_bp.route('/schedules', methods=['GET'])
@token_required
def get_schedules(user_id):
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    status = request.args.get('status')
    priority = request.args.get('priority')
    title = request.args.get('title')  # 添加标题模糊查询参数
    
    query = Schedule.query.filter_by(user_id=user_id)
    
    if title:  # 添加标题模糊查询
        query = query.filter(Schedule.title.like(f'%{title}%'))
    
    if status:
        query = query.filter_by(status=status)
    
    if priority:
        query = query.filter_by(priority=priority)
    
    query = query.order_by(Schedule.start_time.desc())
    
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'schedules': [schedule.to_dict() for schedule in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    }), 200

@schedule_bp.route('/schedules/<int:schedule_id>', methods=['GET'])
@token_required
def get_schedule(user_id, schedule_id):
    schedule = Schedule.query.filter_by(id=schedule_id, user_id=user_id).first()
    
    if not schedule:
        return jsonify({'error': 'Schedule not found'}), 404
    
    return jsonify({'schedule': schedule.to_dict()}), 200

@schedule_bp.route('/schedules', methods=['POST'])
@token_required
def create_schedule(user_id):
    data = request.get_json()
    
    title = data.get('title')
    description = data.get('description', '')
    start_time = data.get('start_time')
    end_time = data.get('end_time')
    priority = data.get('priority', 'medium')
    status = data.get('status', 'pending')
    
    if not title or not start_time or not end_time:
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        start_time = datetime.fromisoformat(start_time)
        end_time = datetime.fromisoformat(end_time)
    except ValueError:
        return jsonify({'error': 'Invalid datetime format'}), 400
    
    schedule = Schedule(
        user_id=user_id,
        title=title,
        description=description,
        start_time=start_time,
        end_time=end_time,
        priority=priority,
        status=status
    )
    
    db.session.add(schedule)
    db.session.commit()
    
    return jsonify({'message': 'Schedule created successfully', 'schedule': schedule.to_dict()}), 201

@schedule_bp.route('/schedules/<int:schedule_id>', methods=['PUT'])
@token_required
def update_schedule(user_id, schedule_id):
    schedule = Schedule.query.filter_by(id=schedule_id, user_id=user_id).first()
    
    if not schedule:
        return jsonify({'error': 'Schedule not found'}), 404
    
    data = request.get_json()
    
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
    
    db.session.commit()
    
    return jsonify({'message': 'Schedule updated successfully', 'schedule': schedule.to_dict()}), 200

@schedule_bp.route('/schedules/<int:schedule_id>', methods=['DELETE'])
@token_required
def delete_schedule(user_id, schedule_id):
    schedule = Schedule.query.filter_by(id=schedule_id, user_id=user_id).first()
    
    if not schedule:
        return jsonify({'error': 'Schedule not found'}), 404
    
    db.session.delete(schedule)
    db.session.commit()
    
    return jsonify({'message': 'Schedule deleted successfully'}), 200

# 日程模板相关接口
@schedule_bp.route('/schedule-templates', methods=['GET'])
@token_required
def get_schedule_templates(user_id):
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    title = request.args.get('title')
    
    query = ScheduleTemplate.query
    
    if title:
        query = query.filter(ScheduleTemplate.title.like(f'%{title}%'))
    
    query = query.order_by(ScheduleTemplate.created_at.desc())
    
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'templates': [template.to_dict() for template in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    }), 200

@schedule_bp.route('/schedule-templates/<int:template_id>', methods=['GET'])
@token_required
def get_schedule_template(user_id, template_id):
    template = ScheduleTemplate.query.filter_by(id=template_id).first()
    
    if not template:
        return jsonify({'error': 'Template not found'}), 404
    
    template_schedules = TemplateSchedule.query.filter_by(template_id=template_id).all()
    
    return jsonify({
        'template': template.to_dict(),
        'schedules': [schedule.to_dict() for schedule in template_schedules]
    }), 200

@schedule_bp.route('/schedule-templates/<int:template_id>/subscribe', methods=['POST'])
@token_required
def subscribe_schedule_template(user_id, template_id):
    template = ScheduleTemplate.query.filter_by(id=template_id).first()
    
    if not template:
        return jsonify({'error': 'Template not found'}), 404
    
    template_schedules = TemplateSchedule.query.filter_by(template_id=template_id).all()
    
    if not template_schedules:
        return jsonify({'error': 'Template has no schedules'}), 400
    
    # 为用户创建日程
    created_schedules = []
    for template_schedule in template_schedules:
        schedule = Schedule(
            user_id=user_id,
            title=template_schedule.title,
            description=template_schedule.description,
            start_time=template_schedule.start_time,
            end_time=template_schedule.end_time,
            priority=template_schedule.priority,
            status=template_schedule.status
        )
        db.session.add(schedule)
        created_schedules.append(schedule)
    
    db.session.commit()
    
    return jsonify({
        'message': f'Successfully subscribed to template "{template.title}"',
        'created_schedules': [schedule.to_dict() for schedule in created_schedules]
    }), 201