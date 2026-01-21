# 配置文件（数据库连接等）
import os

class Config:
    # 数据库连接配置（根据实际情况修改）
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://username:password@localhost:3306/database_name'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.urandom(24)