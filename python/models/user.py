# d:\theme_and_i18n\theme_and_i18n\python\models\user.py
"""
用户数据模型模块

此模块定义了用户表的数据库模型，包括：
1. 用户基本信息（用户名、密码、邮箱等）
2. 用户个性化配置（昵称、头像、简介、语言、主题）
3. 密码安全处理（哈希加密）
4. 与日程表的关系定义

使用 SQLAlchemy ORM 进行数据库操作
"""

from datetime import datetime  # 导入日期时间模块
from werkzeug.security import generate_password_hash, check_password_hash  # 导入密码哈希工具

from .db import db  # 导入数据库实例


class User(db.Model):
    """
    用户模型类
    
    对应数据库中的 'users' 表，存储用户的基本信息和配置
    
    属性说明：
        - 凭证字段：username, password, email
        - 配置字段：nickname, avatar, bio, language, theme
        - 审计字段：created_at, updated_at
        - 关系字段：schedules（关联的日程列表）
    """
    
    __tablename__ = 'users'  # 数据库表名
    
    # ==================== 主键字段 ====================
    id = db.Column(
        db.Integer,           # 整数类型
        primary_key=True,     # 设置为主键
        autoincrement=True    # 自动递增
    )
    
    # ==================== 凭证字段 ====================
    username = db.Column(
        db.String(50),        # 字符串类型，最大长度50
        unique=True,          # 唯一约束，不允许重复
        nullable=False        # 非空约束，必填
    )
    
    password = db.Column(
        db.String(255),       # 字符串类型，最大长度255（存储哈希后的密码）
        nullable=False        # 非空约束
    )
    
    email = db.Column(
        db.String(100),       # 字符串类型，最大长度100
        unique=True,          # 唯一约束
        nullable=False        # 非空约束
    )
    
    # ==================== 配置字段 ====================
    nickname = db.Column(
        db.String(50),        # 昵称
        nullable=True         # 可为空
    )
    
    avatar = db.Column(
        # 头像数据（URL 或 Base64 编码的图片）
        # 使用 LONGTEXT 类型存储大文本（MySQL 中最大 4GB）
        db.Text().with_variant(db.Text(length=4294967295), 'mysql'),
        nullable=True
    )
    
    bio = db.Column(
        db.Text,              # 个人简介（长文本）
        nullable=True
    )
    
    language = db.Column(
        db.String(10),        # 语言设置（如 'zh-CN', 'en-US'）
        default='zh-CN'       # 默认值为简体中文
    )
    
    theme = db.Column(
        db.String(10),        # 主题偏好（'light' 或 'dark'）
        default='light'       # 默认值为浅色主题
    )
    
    # ==================== 审计字段 ====================
    created_at = db.Column(
        db.TIMESTAMP,         # 时间戳类型
        default=datetime.utcnow  # 默认值为创建时的 UTC 时间
    )
    
    updated_at = db.Column(
        db.TIMESTAMP,         # 时间戳类型
        default=datetime.utcnow,  # 默认值为创建时的 UTC 时间
        onupdate=datetime.utcnow  # 更新时自动设置为当前 UTC 时间
    )
    
    # ==================== 关系定义 ====================
    # 定义与 Schedule 模型的一对多关系
    # - 'Schedule'：关联的模型类名
    # - backref='user'：在 Schedule 模型中可以通过 schedule.user 访问关联的用户
    # - lazy=True：延迟加载，只在访问时查询
    # - cascade='all, delete-orphan'：级联操作，删除用户时同时删除其所有日程
    schedules = db.relationship(
        'Schedule',
        backref='user',
        lazy=True,
        cascade='all, delete-orphan'
    )
    
    # ==================== 方法定义 ====================
    def set_password(self, password):
        """
        设置用户密码
        
        使用 Werkzeug 的 generate_password_hash 函数对明文密码进行哈希处理
        采用 PBKDF2 算法，默认迭代 150000 次，增加破解难度
        
        Args:
            password: 明文密码字符串
        
        说明：
            - 不直接存储明文密码
            - 哈希是单向的，无法逆向还原
            - 每次哈希使用随机盐值，相同密码哈希结果不同
        """
        self.password = generate_password_hash(password)
    
    def check_password(self, password):
        """
        验证用户密码
        
        使用 Werkzeug 的 check_password_hash 函数验证明文密码与存储的哈希是否匹配
        
        Args:
            password: 待验证的明文密码字符串
        
        Returns:
            bool: 验证成功返回 True，失败返回 False
        
        说明：
            - 使用恒定时间比较算法，防止时序攻击
            - 自动提取哈希中的盐值进行验证
        """
        return check_password_hash(self.password, password)
    
    def to_dict(self):
        """
        将用户对象转换为字典格式
        
        用于 API 响应，将模型数据序列化为 JSON 可传输的格式
        
        Returns:
            dict: 包含用户信息的字典
        
        说明：
            - 不包含敏感字段（如 password）
            - 日期时间字段使用 isoformat() 转换为 ISO 8601 格式字符串
            - 如果字段为 None，返回 None 而不是调用 isoformat()
        """
        return {
            'id': self.id,                           # 用户ID
            'username': self.username,               # 用户名
            'email': self.email,                     # 邮箱
            'nickname': self.nickname,               # 昵称
            'avatar': self.avatar,                   # 头像
            'bio': self.bio,                         # 个人简介
            'language': self.language,               # 语言设置
            'theme': self.theme,                     # 主题偏好
            'created_at': self.created_at.isoformat() if self.created_at else None,  # 创建时间
            'updated_at': self.updated_at.isoformat() if self.updated_at else None   # 更新时间
        }