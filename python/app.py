# 主应用文件
# app.py
from flask import Flask, render_template

app = Flask(__name__)

# 主页路由
@app.route('/')
def index():
    return render_template('index.html', message='Hello, Flask!')

if __name__ == '__main__':
    app.run(debug=True)


# 确保虚拟环境已激活
# .\venv\Scripts\activate

# 运行Flask应用
# python app.py