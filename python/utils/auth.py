# d:\theme_and_i18n\theme_and_i18n\python\utils\auth.py
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app

SECRET_KEY = 'your-secret-key-change-this-in-production'

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=7),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        if token.startswith('Bearer '):
            token = token[7:]
        
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({'error': 'Token is invalid or expired'}), 401
        
        return f(user_id, *args, **kwargs)
    
    return decorated