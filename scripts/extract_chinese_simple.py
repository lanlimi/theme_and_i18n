#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
简化版国际化中文提取脚本
"""

import os
import re
import json


def extract_chinese_text(text):
    """
    提取文本中的中文
    """
    pattern = r'[\u4e00-\u9fa5]+[\u4e00-\u9fa5\s，。！？；：“”‘’（）【】《》]+[\u4e00-\u9fa5]+|[\u4e00-\u9fa5]+'
    matches = re.findall(pattern, text)
    return [match.strip() for match in matches if match.strip()]


def traverse_directory(directory):
    """
    遍历目录中的所有 TSX 文件
    """
    tsx_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx'):
                tsx_files.append(os.path.join(root, file))
    return tsx_files


def main():
    directory = 'd:\\theme_and_i18n\\theme_and_i18n\\react\\react\\src\\pages'
    output_file = 'd:\\theme_and_i18n\\theme_and_i18n\\react\\react\\src\\locales\\zh_CN.json'
    
    print("开始提取中文文本...")
    
    # 遍历目录获取 TSX 文件
    tsx_files = traverse_directory(directory)
    print(f"找到 {len(tsx_files)} 个 TSX 文件")
    
    # 提取中文文本
    all_chinese = []
    for file_path in tsx_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                chinese_texts = extract_chinese_text(content)
                all_chinese.extend(chinese_texts)
        except Exception as e:
            print(f"读取文件 {file_path} 时出错: {e}")
    
    # 去重
    unique_chinese = list(set(all_chinese))
    unique_chinese.sort()
    
    print(f"共提取到 {len(unique_chinese)} 条唯一中文文本")
    
    # 写入 JSON 文件
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(unique_chinese, f, ensure_ascii=False, indent=2)
    
    print(f"中文文本已保存到: {output_file}")
    print("提取完成！")


if __name__ == '__main__':
    main()
