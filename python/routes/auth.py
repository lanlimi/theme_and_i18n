# d:\theme_and_i18n\theme_and_i18n\python\routes\auth.py
from flask import Blueprint, request, jsonify
from models import User, db
from utils.auth import token_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    
    if not username or not password or not email:
        return jsonify({'error': 'Missing required fields'}), 400
    
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    user = User(username=username, email=email)
    user.set_password(password)
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully', 'user': user.to_dict()}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    username = data.get('username')
    password = data.get('password')
    
    print(f"[DEBUG] 登录请求 - 用户名: {username}, 密码: {password}")
    
    if not username or not password:
        return jsonify({'error': 'Missing username or password'}), 400
    
    user = User.query.filter_by(username=username).first()
    
    print(f"[DEBUG] 查询用户结果: {user}")
    
    if not user:
        print(f"[DEBUG] 用户 '{username}' 不存在")
        return jsonify({'error': '账号错误'}), 401
    
    password_match = user.check_password(password)
    print(f"[DEBUG] 密码匹配结果: {password_match}")
    
    if not password_match:
        print(f"[DEBUG] 密码不匹配")
        return jsonify({'error': '密码错误'}), 401
    
    from utils.auth import generate_token
    token = generate_token(user.id)
    
    print(f"[DEBUG] 登录成功 - 用户ID: {user.id}, Token: {token}")
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(user_id):
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'user': user.to_dict()}), 200

@auth_bp.route('/me', methods=['PUT'])
@token_required
def update_user(user_id):
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    try:
        data = request.get_json()
        print(f"[DEBUG] 更新用户信息 - 用户ID: {user_id}, 数据: {data}")
        
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
        
        db.session.commit()
        print(f"[DEBUG] 用户信息更新成功")
        return jsonify({'message': 'User updated successfully', 'user': user.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        print(f"[ERROR] 更新用户信息失败: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'更新失败: {str(e)}'}), 500

@auth_bp.route('/change-password', methods=['POST'])
@token_required
def change_password(user_id):
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    old_password = data.get('old_password')
    new_password = data.get('new_password')
    
    if not old_password or not new_password:
        return jsonify({'error': 'Missing required fields'}), 400
    
    if not user.check_password(old_password):
        return jsonify({'error': '旧密码错误'}), 401
    
    user.set_password(new_password)
    db.session.commit()
    return jsonify({'message': 'Password changed successfully'}), 200