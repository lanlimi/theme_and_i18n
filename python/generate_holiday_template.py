#!/usr/bin/env python3
# d:\theme_and_i18n\theme_and_i18n\python\generate_holiday_template.py
# 生成2026年节假日日程模板并插入数据库

from datetime import datetime
from models import db, ScheduleTemplate, TemplateSchedule
from app import app

# 2026年节假日数据
HOLIDAYS_2026 = [
    # 元旦
    {"title": "2026年元旦", "date": "2026-01-01", "description": "元旦节"},
    # 春节
    {"title": "2026年春节", "date": "2026-02-17", "description": "春节"},
    {"title": "2026年春节", "date": "2026-02-18", "description": "春节"},
    {"title": "2026年春节", "date": "2026-02-19", "description": "春节"},
    {"title": "2026年春节", "date": "2026-02-20", "description": "春节"},
    {"title": "2026年春节", "date": "2026-02-21", "description": "春节"},
    {"title": "2026年春节", "date": "2026-02-22", "description": "春节"},
    {"title": "2026年春节", "date": "2026-02-23", "description": "春节"},
    # 清明节
    {"title": "2026年清明节", "date": "2026-04-04", "description": "清明节"},
    {"title": "2026年清明节", "date": "2026-04-05", "description": "清明节"},
    {"title": "2026年清明节", "date": "2026-04-06", "description": "清明节"},
    # 劳动节
    {"title": "2026年劳动节", "date": "2026-05-01", "description": "劳动节"},
    {"title": "2026年劳动节", "date": "2026-05-02", "description": "劳动节"},
    {"title": "2026年劳动节", "date": "2026-05-03", "description": "劳动节"},
    # 端午节
    {"title": "2026年端午节", "date": "2026-06-20", "description": "端午节"},
    {"title": "2026年端午节", "date": "2026-06-21", "description": "端午节"},
    {"title": "2026年端午节", "date": "2026-06-22", "description": "端午节"},
    # 中秋节
    {"title": "2026年中秋节", "date": "2026-09-26", "description": "中秋节"},
    {"title": "2026年中秋节", "date": "2026-09-27", "description": "中秋节"},
    {"title": "2026年中秋节", "date": "2026-09-28", "description": "中秋节"},
    # 国庆节
    {"title": "2026年国庆节", "date": "2026-10-01", "description": "国庆节"},
    {"title": "2026年国庆节", "date": "2026-10-02", "description": "国庆节"},
    {"title": "2026年国庆节", "date": "2026-10-03", "description": "国庆节"},
    {"title": "2026年国庆节", "date": "2026-10-04", "description": "国庆节"},
    {"title": "2026年国庆节", "date": "2026-10-05", "description": "国庆节"},
    {"title": "2026年国庆节", "date": "2026-10-06", "description": "国庆节"},
    {"title": "2026年国庆节", "date": "2026-10-07", "description": "国庆节"},
]

def generate_holiday_template():
    with app.app_context():
        # 检查是否已存在2026年节假日模板
        existing_template = ScheduleTemplate.query.filter_by(title="2026年节假日日程").first()
        if existing_template:
            print("2026年节假日模板已存在，跳过生成")
            return
        
        # 创建模板
        template = ScheduleTemplate(
            title="2026年节假日日程",
            description="2026年全年法定节假日日程安排，包括元旦、春节、清明节、劳动节、端午节、中秋节和国庆节"
        )
        db.session.add(template)
        db.session.flush()  # 获取template.id
        
        # 添加节假日日程
        for holiday in HOLIDAYS_2026:
            start_time = datetime.strptime(holiday["date"], "%Y-%m-%d")
            end_time = datetime.strptime(holiday["date"], "%Y-%m-%d")
            end_time = end_time.replace(hour=23, minute=59, second=59)
            
            template_schedule = TemplateSchedule(
                template_id=template.id,
                title=holiday["title"],
                description=holiday["description"],
                start_time=start_time,
                end_time=end_time,
                priority="medium",
                status="pending"
            )
            db.session.add(template_schedule)
        
        # 提交数据
        db.session.commit()
        print("2026年节假日模板生成成功！")

if __name__ == "__main__":
    generate_holiday_template()