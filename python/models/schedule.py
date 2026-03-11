# d:\theme_and_i18n\theme_and_i18n\python\models\schedule.py
"""
日程数据模型模块

此模块定义了日程相关的数据库模型，包括：
1. Schedule（日程）：用户创建的日程事项
2. ScheduleTemplate（日程模板）：可复用的日程模板
3. TemplateSchedule（模板日程）：模板中包含的具体日程项

使用 SQLAlchemy ORM 进行数据库操作
"""

from datetime import datetime  # 导入日期时间模块

from .db import db  # 导入数据库实例


class Schedule(db.Model):
    """
    日程模型类
    
    对应数据库中的 'schedules' 表，存储用户创建的日程事项
    
    属性说明：
        - 关联字段：user_id（所属用户）
        - 内容字段：title, description
        - 时间字段：start_time, end_time
        - 状态字段：priority（优先级）, status（状态）
        - 审计字段：created_at, updated_at
    
    关系：
        - 多对一：多个日程属于一个用户（通过 user_id 外键关联）
    """
    
    __tablename__ = 'schedules'  # 数据库表名
    
    # ==================== 主键字段 ====================
    id = db.Column(
        db.Integer,           # 整数类型
        primary_key=True,     # 设置为主键
        autoincrement=True    # 自动递增
    )
    
    # ==================== 关联字段 ====================
    user_id = db.Column(
        db.Integer,           # 整数类型
        # 外键约束：关联到 users 表的 id 字段
        db.ForeignKey('users.id', ondelete='CASCADE'),
        nullable=False        # 非空约束，每个日程必须属于一个用户
    )
    # 说明：ondelete='CASCADE' 表示当用户被删除时，其所有日程也会被级联删除
    
    # ==================== 内容字段 ====================
    title = db.Column(
        db.String(200),       # 日程标题，最大长度200
        nullable=False        # 非空约束
    )
    
    description = db.Column(
        db.Text               # 日程描述（长文本）
    )
    
    # ==================== 时间字段 ====================
    start_time = db.Column(
        db.DATETIME,          # 开始时间
        nullable=False        # 非空约束
    )
    
    end_time = db.Column(
        db.DATETIME,          # 结束时间
        nullable=False        # 非空约束
    )
    
    # ==================== 状态字段 ====================
    priority = db.Column(
        # 优先级枚举：high（高）、medium（中）、low（低）
        db.Enum('high', 'medium', 'low'),
        default='medium'      # 默认值为中等优先级
    )
    
    status = db.Column(
        # 状态枚举：pending（待处理）、in_progress（进行中）、completed（已完成）
        db.Enum('pending', 'in_progress', 'completed'),
        default='pending'     # 默认值为待处理
    )
    
    # ==================== 审计字段 ====================
    created_at = db.Column(
        db.TIMESTAMP,         # 创建时间
        default=datetime.utcnow  # 默认值为创建时的 UTC 时间
    )
    
    updated_at = db.Column(
        db.TIMESTAMP,         # 更新时间
        default=datetime.utcnow,  # 默认值为创建时的 UTC 时间
        onupdate=datetime.utcnow  # 更新时自动设置为当前 UTC 时间
    )
    
    # ==================== 方法定义 ====================
    def to_dict(self):
        """
        将日程对象转换为字典格式
        
        用于 API 响应，将模型数据序列化为 JSON 可传输的格式
        
        Returns:
            dict: 包含日程信息的字典
        """
        return {
            'id': self.id,                           # 日程ID
            'user_id': self.user_id,                 # 所属用户ID
            'title': self.title,                     # 标题
            'description': self.description,         # 描述
            'start_time': self.start_time.isoformat() if self.start_time else None,  # 开始时间
            'end_time': self.end_time.isoformat() if self.end_time else None,        # 结束时间
            'priority': self.priority,               # 优先级
            'status': self.status,                   # 状态
            'created_at': self.created_at.isoformat() if self.created_at else None,  # 创建时间
            'updated_at': self.updated_at.isoformat() if self.updated_at else None   # 更新时间
        }


class ScheduleTemplate(db.Model):
    """
    日程模板模型类
    
    对应数据库中的 'schedule_templates' 表，存储可复用的日程模板
    
    用途：
        - 用户可以订阅模板，快速创建一系列预设的日程
        - 例如："每日工作计划"、"健身计划"等模板
    
    关系：
        - 一对多：一个模板包含多个模板日程（TemplateSchedule）
    """
    
    __tablename__ = 'schedule_templates'  # 数据库表名
    
    # ==================== 主键字段 ====================
    id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True
    )
    
    # ==================== 内容字段 ====================
    title = db.Column(
        db.String(200),       # 模板标题
        nullable=False
    )
    
    description = db.Column(
        db.Text               # 模板描述
    )
    
    # ==================== 审计字段 ====================
    created_at = db.Column(
        db.TIMESTAMP,
        default=datetime.utcnow
    )
    
    updated_at = db.Column(
        db.TIMESTAMP,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
    
    # ==================== 方法定义 ====================
    def to_dict(self):
        """将模板对象转换为字典格式"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class TemplateSchedule(db.Model):
    """
    模板日程模型类
    
    对应数据库中的 'template_schedules' 表，存储模板中包含的具体日程项
    
    用途：
        - 定义 ScheduleTemplate 中包含的具体日程
        - 用户订阅模板时，系统根据这些定义创建实际的 Schedule
    
    与 Schedule 的区别：
        - Schedule：用户实际创建的日程，关联到具体用户
        - TemplateSchedule：模板中的日程定义，不关联到用户，只作为模板的一部分
    
    关系：
        - 多对一：多个模板日程属于一个模板（通过 template_id 外键关联）
    """
    
    __tablename__ = 'template_schedules'  # 数据库表名
    
    # ==================== 主键字段 ====================
    id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True
    )
    
    # ==================== 关联字段 ====================
    template_id = db.Column(
        db.Integer,
        # 外键约束：关联到 schedule_templates 表的 id 字段
        db.ForeignKey('schedule_templates.id', ondelete='CASCADE'),
        nullable=False
    )
    # 说明：ondelete='CASCADE' 表示当模板被删除时，其所有模板日程也会被级联删除
    
    # ==================== 内容字段 ====================
    title = db.Column(
        db.String(200),       # 日程标题
        nullable=False
    )
    
    description = db.Column(
        db.Text               # 日程描述
    )
    
    # ==================== 时间字段 ====================
    start_time = db.Column(
        db.DATETIME,          # 开始时间（模板中的相对时间或示例时间）
        nullable=False
    )
    
    end_time = db.Column(
        db.DATETIME,          # 结束时间
        nullable=False
    )
    
    # ==================== 状态字段 ====================
    priority = db.Column(
        db.Enum('high', 'medium', 'low'),
        default='medium'
    )
    
    status = db.Column(
        db.Enum('pending', 'in_progress', 'completed'),
        default='pending'
    )
    
    # ==================== 审计字段 ====================
    created_at = db.Column(
        db.TIMESTAMP,
        default=datetime.utcnow
    )
    
    updated_at = db.Column(
        db.TIMESTAMP,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
    
    # ==================== 方法定义 ====================
    def to_dict(self):
        """将模板日程对象转换为字典格式"""
        return {
            'id': self.id,
            'template_id': self.template_id,         # 所属模板ID
            'title': self.title,
            'description': self.description,
            'start_time': self.start_time.isoformat() if self.start_time else None,
            'end_time': self.end_time.isoformat() if self.end_time else None,
            'priority': self.priority,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }