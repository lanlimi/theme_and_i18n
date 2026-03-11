# d:\theme_and_i18n\theme_and_i18n\python\routes\auth.py
"""
用户认证模块

此模块提供用户认证相关的 RESTful API 接口，包括：
1. 用户注册
2. 用户登录
3. 获取当前用户信息
4. 更新用户信息
5. 修改密码
6. 退出登录

所有需要登录才能访问的接口均使用 @token_required 装饰器进行保护
"""

from flask import Blueprint, request, jsonify  # 导入 Flask 相关模块
from models import User, db  # 导入用户模型和数据库实例
from utils.auth import token_required  # 导入 JWT 认证装饰器

# 创建 Blueprint，用于组织认证相关的路由
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    用户注册接口
    
    创建新用户账号，需要验证用户名和邮箱的唯一性
    
    Request JSON:
        username: 用户名（必填，唯一）
        password: 密码（必填）
        email: 邮箱（必填，唯一）
    
    Returns:
        JSON: 包含注册成功信息和用户详情的响应
    
    状态码:
        201: 注册成功
        400: 请求参数错误或用户名/邮箱已存在
    """
    # 获取请求体中的 JSON 数据
    data = request.get_json()
    
    # 提取用户输入的参数
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    
    # 校验必填字段是否完整
    if not username or not password or not email:
        return jsonify({'error': 'Missing required fields'}), 400
    
    # 检查用户名是否已存在
    # User.query.filter_by(username=username).first() 查询数据库中是否有该用户名的用户
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    # 检查邮箱是否已存在
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    # 创建新用户对象
    # 注意：密码不直接存储，而是通过 set_password 方法进行哈希处理
    user = User(username=username, email=email)
    user.set_password(password)  # 使用 Werkzeug 进行密码哈希
    
    # 将用户添加到数据库会话
    db.session.add(user)
    # 提交事务，将数据持久化到数据库
    db.session.commit()
    
    # 返回注册成功响应，包含用户信息（通过 to_dict() 序列化）
    return jsonify({'message': 'User registered successfully', 'user': user.to_dict()}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    用户登录接口
    
    验证用户凭据，成功后返回 JWT 令牌
    
    Request JSON:
        username: 用户名（必填）
        password: 密码（必填）
    
    Returns:
        JSON: 包含登录成功信息、JWT 令牌和用户详情的响应
    
    状态码:
        200: 登录成功
        400: 请求参数缺失
        401: 用户名或密码错误
    """
    # 获取请求体中的 JSON 数据
    data = request.get_json()
    
    # 提取用户名和密码
    username = data.get('username')
    password = data.get('password')
    
    # 调试日志：记录登录请求（生产环境应移除或脱敏）
    print(f"[DEBUG] 登录请求 - 用户名: {username}, 密码: {password}")
    
    # 校验必填字段
    if not username or not password:
        return jsonify({'error': 'Missing username or password'}), 400
    
    # 根据用户名查询用户
    user = User.query.filter_by(username=username).first()
    
    print(f"[DEBUG] 查询用户结果: {user}")
    
    # 检查用户是否存在
    if not user:
        print(f"[DEBUG] 用户 '{username}' 不存在")
        return jsonify({'error': '账号错误'}), 401
    
    # 验证密码是否正确
    # check_password 方法使用 Werkzeug 验证哈希密码
    password_match = user.check_password(password)
    print(f"[DEBUG] 密码匹配结果: {password_match}")
    
    if not password_match:
        print(f"[DEBUG] 密码不匹配")
        return jsonify({'error': '密码错误'}), 401
    
    # 密码验证通过，生成 JWT 令牌
    from utils.auth import generate_token
    token = generate_token(user.id)
    
    print(f"[DEBUG] 登录成功 - 用户ID: {user.id}, Token: {token}")
    
    # 返回登录成功响应，包含令牌和用户信息
    return jsonify({
        'message': 'Login successful',
        'token': token,  # JWT 令牌，前端需保存并在后续请求中携带
        'user': user.to_dict()
    }), 200

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(user_id):
    """
    获取当前用户信息接口
    
    需要登录才能访问，返回当前登录用户的详细信息
    
    Args:
        user_id: 从 @token_required 装饰器注入的当前用户 ID
    
    Headers:
        Authorization: Bearer <JWT令牌>
    
    Returns:
        JSON: 包含用户详情的响应
    
    状态码:
        200: 成功
        401: 未授权（令牌无效或过期）
        404: 用户不存在
    """
    # 根据 user_id 查询用户
    user = User.query.filter_by(id=user_id).first()
    
    # 检查用户是否存在（理论上应该存在，因为 token 是有效的）
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # 返回用户信息
    return jsonify({'user': user.to_dict()}), 200

@auth_bp.route('/me', methods=['PUT'])
@token_required
def update_user(user_id):
    """
    更新当前用户信息接口
    
    需要登录才能访问，支持部分字段更新
    
    Args:
        user_id: 从 @token_required 装饰器注入的当前用户 ID
    
    Headers:
        Authorization: Bearer <JWT令牌>
    
    Request JSON:
        nickname: 昵称（可选）
        avatar: 头像（Base64字符串，可选）
        bio: 个人简介（可选）
        language: 语言设置（可选）
        theme: 主题偏好（可选）
    
    Returns:
        JSON: 包含更新成功信息和用户详情的响应
    
    状态码:
        200: 更新成功
        401: 未授权
        404: 用户不存在
        500: 服务器内部错误
    """
    # 根据 user_id 查询用户
    user = User.query.filter_by(id=user_id).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    try:
        # 获取请求体中的 JSON 数据
        data = request.get_json()
        print(f"[DEBUG] 更新用户信息 - 用户ID: {user_id}, 数据: {data}")
        
        # 动态更新字段：只更新请求中提供的字段
        if 'nickname' in data:
            user.nickname = data['nickname']
        if 'avatar' in data:
            user.avatar = data['avatar']
            print(f"[DEBUG] 更新头像 - 头像数据长度: {len(data['avatar']) if data['avatar'] else 0}")
        if 'bio' in data:
            user.bio = data['bio']
        if 'language' in data:
            user.language = data['language']
        if 'theme' in data:
            user.theme = data['theme']
        
        # 提交事务，保存更改
        db.session.commit()
        print(f"[DEBUG] 用户信息更新成功")
        
        return jsonify({'message': 'User updated successfully', 'user': user.to_dict()}), 200
    except Exception as e:
        # 发生异常时回滚事务，避免数据不一致
        db.session.rollback()
        print(f"[ERROR] 更新用户信息失败: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'更新失败: {str(e)}'}), 500

@auth_bp.route('/change-password', methods=['POST'])
@token_required
def change_password(user_id):
    """
    修改密码接口
    
    需要登录才能访问，要求提供旧密码进行验证
    
    Args:
        user_id: 从 @token_required 装饰器注入的当前用户 ID
    
    Headers:
        Authorization: Bearer <JWT令牌>
    
    Request JSON:
        old_password: 旧密码（必填）
        new_password: 新密码（必填）
    
    Returns:
        JSON: 包含修改成功信息的响应
    
    状态码:
        200: 修改成功
        400: 请求参数缺失
        401: 未授权或旧密码错误
        404: 用户不存在
    """
    # 根据 user_id 查询用户
    user = User.query.filter_by(id=user_id).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # 获取请求体中的 JSON 数据
    data = request.get_json()
    old_password = data.get('old_password')
    new_password = data.get('new_password')
    
    # 校验必填字段
    if not old_password or not new_password:
        return jsonify({'error': 'Missing required fields'}), 400
    
    # 验证旧密码是否正确
    if not user.check_password(old_password):
        return jsonify({'error': '旧密码错误'}), 401
    
    # 设置新密码（自动进行哈希处理）
    user.set_password(new_password)
    # 提交事务
    db.session.commit()
    
    return jsonify({'message': 'Password changed successfully'}), 200

@auth_bp.route('/logout', methods=['POST'])
@token_required
def logout(user_id):
    """
    退出登录接口
    
    需要登录才能访问，后端记录退出日志
    由于 JWT 是无状态的，实际的令牌清除由前端负责
    
    Args:
        user_id: 从 @token_required 装饰器注入的当前用户 ID
    
    Headers:
        Authorization: Bearer <JWT令牌>
    
    Returns:
        JSON: 包含退出成功信息的响应
    
    状态码:
        200: 退出成功
        401: 未授权
        404: 用户不存在
    
    说明：
        JWT 是无状态的，后端无法直接使令牌失效。
        前端需要在收到响应后清除本地存储的 token。
        如需实现令牌黑名单机制，需要额外的存储（如 Redis）。
    """
    # 根据 user_id 查询用户
    user = User.query.filter_by(id=user_id).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    print(f"[DEBUG] 用户退出登录 - 用户ID: {user_id}, 用户名: {user.username}")
    
    # 在实际应用中，可以在这里做一些清理工作，例如：
    # 1. 将 token 加入黑名单（需要实现 token 黑名单机制）
    # 2. 记录退出日志
    # 3. 清理用户的临时数据
    # 4. 更新用户的最后活跃时间
    
    # 由于 JWT 是无状态的，后端无法直接使 token 失效
    # 主要的安全措施由前端负责（清除本地存储的 token）
    
    return jsonify({'message': 'Logout successful'}), 200