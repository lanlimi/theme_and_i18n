#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
国际化中文提取脚本
功能：提取 src/pages 目录下所有 TSX 文件中的中文文本，保存到 zh_CN.json
"""

import os
import re
import json
import argparse


def extract_chinese_text(text):
    """
    提取文本中的中文
    :param text: 文本内容
    :return: 中文文本列表
    """
    # 匹配中文字符和常见标点
    pattern = r'[\u4e00-\u9fa5]+[\u4e00-\u9fa5\s，。！？；：“”‘’（）【】《》]+[\u4e00-\u9fa5]+|[\u4e00-\u9fa5]+'
    matches = re.findall(pattern, text)
    # 过滤空字符串和纯空格
    return [match.strip() for match in matches if match.strip()]


def traverse_directory(directory):
    """
    遍历目录中的所有 TSX 文件
    :param directory: 目录路径
    :return: 文件路径列表
    """
    tsx_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx'):
                tsx_files.append(os.path.join(root, file))
    return tsx_files


def main():
    parser = argparse.ArgumentParser(description='提取 TSX 文件中的中文文本')
    parser.add_argument('--directory', default='d:\\theme_and_i18n\\theme_and_i18n\\react\\react\\src\\pages',
                      help='要遍历的目录路径')
    parser.add_argument('--output', default='d:\\theme_and_i18n\\theme_and_i18n\\react\\react\\src\\locales\\zh_CN.json',
                      help='输出文件路径')
    
    args = parser.parse_args()
    directory = args.directory
    output_file = args.output
    
    print(f"开始提取目录: {directory} 中的中文文本")
    
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
                if chinese_texts:
                    print(f"  {file_path}: 提取到 {len(chinese_texts)} 条中文")
        except Exception as e:
            print(f"  读取文件 {file_path} 时出错: {e}")
    
    # 去重
    unique_chinese = list(set(all_chinese))
    unique_chinese.sort()  # 排序以保持一致性
    
    print(f"\n共提取到 {len(unique_chinese)} 条唯一中文文本")
    
    # 确保输出目录存在
    output_dir = os.path.dirname(output_file)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # 写入 JSON 文件
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(unique_chinese, f, ensure_ascii=False, indent=2)
    
    print(f"\n中文文本已保存到: {output_file}")
    print("提取完成！")


if __name__ == '__main__':
    main()
