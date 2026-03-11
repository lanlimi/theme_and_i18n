# d:\theme_and_i18n\theme_and_i18n\python\utils\auth.py
"""
认证工具模块

此模块提供 JWT (JSON Web Token) 相关的认证功能，包括：
1. 生成 JWT 令牌
2. 验证 JWT 令牌
3. 提供认证装饰器，保护需要登录才能访问的 API 接口
"""

import jwt  # 导入 JWT 库，用于生成和验证令牌
from datetime import datetime, timedelta  # 导入日期时间相关模块，用于设置令牌过期时间
from functools import wraps  # 导入 wraps 装饰器，用于保留原函数的元数据
from flask import request, jsonify, current_app  # 导入 Flask 相关模块

# JWT 签名密钥，生产环境中应使用复杂的随机字符串并从环境变量中读取
# 注意：当前为示例密钥，实际部署时必须修改
SECRET_KEY = 'your-secret-key-change-this-in-production'


def generate_token(user_id):
    """
    生成 JWT 令牌
    
    Args:
        user_id: 用户 ID，作为令牌的主要标识
    
    Returns:
        str: 生成的 JWT 令牌字符串
    
    说明：
        - 令牌包含三个部分：user_id（用户标识）、exp（过期时间）、iat（签发时间）
        - 过期时间设置为当前时间后 7 天
        - 使用 HS256 算法进行签名
    """
    # 构建令牌载荷（payload）
    payload = {
        'user_id': user_id,  # 用户 ID，用于标识用户身份
        'exp': datetime.utcnow() + timedelta(days=7),  # 过期时间：当前时间后 7 天
        'iat': datetime.utcnow()  # 签发时间：当前时间
    }
    
    # 使用密钥对载荷进行签名，生成 JWT 令牌
    # algorithm='HS256' 指定使用 HMAC SHA-256 算法
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')


def verify_token(token):
    """
    验证 JWT 令牌
    
    Args:
        token: 要验证的 JWT 令牌字符串
    
    Returns:
        int or None: 验证成功返回用户 ID，验证失败返回 None
    
    说明：
        - 尝试解码令牌，验证其有效性
        - 捕获过期和无效令牌异常
        - 验证成功后返回令牌中的 user_id
    """
    try:
        # 使用密钥解码令牌，验证签名
        # algorithms=['HS256'] 指定使用的算法，必须与生成时一致
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        
        # 从载荷中提取 user_id 并返回
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        # 令牌已过期
        return None
    except jwt.InvalidTokenError:
        # 令牌无效（签名错误、格式错误等）
        return None


def token_required(f):
    """
    认证装饰器，用于保护需要登录才能访问的 API 接口
    
    Args:
        f: 需要保护的视图函数
    
    Returns:
        function: 包装后的视图函数
    
    说明：
        - 从请求头中提取 Authorization 字段
        - 验证令牌的存在性和有效性
        - 验证通过后将 user_id 注入到原函数的参数中
        - 验证失败返回 401 未授权错误
    """
    # 使用 wraps 装饰器保留原函数的元数据（如函数名、文档字符串等）
    @wraps(f)
    def decorated(*args, **kwargs):
        # 从请求头中获取 Authorization 字段
        token = request.headers.get('Authorization')
        
        # 检查令牌是否存在
        if not token:
            return jsonify({'error': 'Token is missing'}), 401  # 401 未授权错误
        
        # 处理 Bearer 前缀（标准的 Authorization 格式：Bearer <token>）
        if token.startswith('Bearer '):
            # 移除 'Bearer ' 前缀，获取纯令牌字符串
            token = token[7:]
        
        # 验证令牌有效性
        user_id = verify_token(token)
        
        # 检查验证结果
        if not user_id:
            return jsonify({'error': 'Token is invalid or expired'}), 401  # 401 未授权错误
        
        # 验证通过，将 user_id 作为第一个参数传递给原函数
        return f(user_id, *args, **kwargs)
    
    # 返回包装后的函数
    return decorated