import i18n from 'i18next';
import { initReactI18next, useTranslation as useI18nTranslation } from 'react-i18next';
import { getBrowserLang } from '@/utils/getBrowserLang';
// 导入locales目录下的语言文件，确保与locales/index.ts使用相同的数据源
import zh_CN from '../locales/zh_CN.json';
import en_US from '../locales/en_US.json';

// // 将zh_CN数组转换为对象格式，使其与en_US格式一致
const zhCNObj: Record<string, string> = {};
zh_CN.forEach(key => {
  zhCNObj[key] = key;
});

/**
 * @description 初始化国际化配置
 * @return {Promise<void>}
 */
export const injectI18n = async () => {
  // 初始化i18next实例
  i18n
    // 使用initReactI18next插件，将i18n实例传递给react-i18next
    .use(initReactI18next) // passes i18n down to react-i18next
    // 配置i18next实例
    .init({
      // 设置语言数据 - 初始化时只加载两种基础语言
      // 这是应用启动时预加载的语言包，只包含最常用的中英文
      resources: {
        zh_CN: {
          translation: zhCNObj
        },
        en_US: {
          translation: en_US
        },
      },
      debug: false,
      // 初始语言设置
      // 使用浏览器语言作为初始语言
      lng: getBrowserLang(), // 浏览器语言
      fallbackLng: 'zh_CN', // 当指定语言的某些翻译不存在时，回退到中文
      interpolation: {
        escapeValue: false // react already safes from xss
      }
    });
};

/**
 * @description 自定义翻译hook，支持命名空间
 * @param {string} nameSpace - 可选的命名空间，用于组织翻译文本的分类
 * @return {Object} 包含翻译函数的对象
 */
export function useTranslation(nameSpace?: string) {
  // 调用react-i18next提供的原生useTranslation hook获取翻译函数
  // useI18nTranslation是从react-i18next导入的，提供了核心翻译功能
  const { t } = useI18nTranslation();
  
  return {
    t: (name: string) => {
      // 如果提供了命名空间，就使用命名空间前缀构建完整的翻译键
      if (nameSpace) {
        return t(`${nameSpace}.${name}`);
      } else {
        // 如果没有命名空间，直接使用传入的名称作为翻译键
        return t(name);
      }
    }
  };
}

/**
 * @description 获取当前语言
 * @return {string} 当前语言代码
 */
export function getCurrentLanguage() {
  return i18n.language;
}

/**
 * @description 切换语言
 * @param {string} lang - 语言代码
 */
export function changeI18nLanguage(lang: string) {
  i18n.changeLanguage(lang);
}
