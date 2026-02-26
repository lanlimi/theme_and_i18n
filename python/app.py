# 主应用文件
# app.py
from flask import Flask, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config
from models import db
from routes import auth_bp, schedule_bp

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:8069", "http://localhost:5269", "http://localhost:3000", "http://localhost:5000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(schedule_bp, url_prefix='/api')

@app.route('/api/health')
def health():
    return jsonify({'status': 'ok', 'message': 'API is running'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)


# 激活虚拟环境
# .\venv\Scripts\Activate.ps1

# 启动后端
# python app.py