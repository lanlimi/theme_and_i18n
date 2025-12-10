import json
import os
from translate import Translator

def read_chinese_phrases():
    """读取language.ts文件，提取中文字符串列表"""
    file_path = 'language.ts'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    # 解析TypeScript数组
    phrases = eval(content)
    return phrases

def translate_text(text, target_lang):
    """使用translate库翻译文本"""
    try:
        translator = Translator(to_lang=target_lang)
        result = translator.translate(text)
        return result
    except Exception as e:
        print(f"翻译'{text}'到{target_lang}时出错: {e}")
        return text

def main():
    # 读取中文字符串列表
    chinese_phrases = read_chinese_phrases()
    
    # 定义目标语言及其对应的文件名称
    languages = {
        'en': 'en-US.json',
        'ja': 'ja-JP.json',
        'zh-TW': 'zh-TW.json'
    }
    
    # 为每种语言生成翻译文件
    for lang_code, file_name in languages.items():
        translations = {}
        for phrase in chinese_phrases:
            # 翻译文本
            translated = translate_text(phrase, lang_code)
            translations[phrase] = translated
        
        # 生成输出文件路径
        output_path = os.path.join('translations', file_name)
        
        # 写入JSON文件
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(translations, f, ensure_ascii=False, indent=2)
        
        print(f"已生成翻译文件: {output_path}")

if __name__ == '__main__':
    main()