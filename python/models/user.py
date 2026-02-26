# d:\theme_and_i18n\theme_and_i18n\python\models\user.py
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

from .db import db

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    nickname = db.Column(db.String(50), nullable=True)  # 昵称
    avatar = db.Column(db.String(255), nullable=True)  # 头像URL
    bio = db.Column(db.Text, nullable=True)  # 个人简介
    language = db.Column(db.String(10), default='zh-CN')  # 语言设置
    theme = db.Column(db.String(10), default='light')  # 主题偏好
    created_at = db.Column(db.TIMESTAMP, default=datetime.utcnow)
    updated_at = db.Column(db.TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    schedules = db.relationship('Schedule', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'nickname': self.nickname,
            'avatar': self.avatar,
            'bio': self.bio,
            'language': self.language,
            'theme': self.theme,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }