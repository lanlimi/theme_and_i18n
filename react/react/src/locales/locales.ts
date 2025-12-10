import local from './zh_CN.json'
import i18n from "i18next";
// 统一使用下划线格式的语言代码，与i18n配置一致
const langList = ['zh_CN', 'en_US'];

const loadLanguageAsync = (locale: string) => {
    // 将短横线格式转换为下划线格式，如 'zh-CN' -> 'zh_CN'
    const normalizedLocale = locale.replace('-', '_');
    
    // 检查语言是否在支持列表中
    if (!langList.includes(normalizedLocale)) {
        i18n.changeLanguage("zh_CN");
        return;
    }
    
    // 切换i18n语言
    i18n.changeLanguage(normalizedLocale);
}

/**
 * @description 设置Ant Design组件库的语言
 * @return {Promise<any>} Ant Design语言包
 */
export async function setAntdLocale() {
  // 设置组件库语言
  const antdPkgEnum = {
    zh_CN: import('antd/es/locale/zh_CN'),
    en_US: import('antd/es/locale/en_US'),
    zh_TW: import('antd/es/locale/zh_TW'),
    id_ID: import('antd/es/locale/id_ID'),
    vi_VN: import('antd/es/locale/vi_VN'),
    ru_RU: import('antd/es/locale/ru_RU'),
    fr_FR: import('antd/es/locale/fr_FR'),
    de_DE: import('antd/es/locale/de_DE'),
    ja_JP: import('antd/es/locale/ja_JP'),
    ko_KR: import('antd/es/locale/ko_KR'),
    pl_PL: import('antd/es/locale/pl_PL'),
    he_IL: import('antd/es/locale/he_IL'),
    tr_TR: import('antd/es/locale/tr_TR'),
    ar_EG: import('antd/es/locale/ar_EG'),
    es_ES: import('antd/es/locale/es_ES'),
    zh_HK: import('antd/es/locale/zh_HK'),
    th_TH: import('antd/es/locale/th_TH'),
  };

  // 根据URL设置的语言包，或者浏览器语言设置组件的语言
  const urlLang = (window as any).svj_locale || '';
  const antdLang = urlLang.replace('-', '_');
  // 检查URL设置的语言是否在组件库语言包中，没有则默认使用zh_CN
  const lang = Object.keys(antdPkgEnum).includes(antdLang) ? antdLang : 'zh_CN';

  // 返回的是一个Promise，需要在使用时await解析
  return antdPkgEnum[lang as keyof typeof antdPkgEnum];
}

export default loadLanguageAsync;