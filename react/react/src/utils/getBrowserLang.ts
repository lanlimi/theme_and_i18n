import { LANGUAGE } from "@/config/language";

/**
 * @description 获取浏览器默认语言
 * @return string
 */
export const getBrowserLang = () => {
  const navigator :any = window.navigator
  const browserLang = navigator.language ? navigator.language : navigator.browserLanguage
  // 在映射表中查找匹配的语言包
  const matchedLang = LANGUAGE.find(lang => 
    lang.langList.includes(browserLang)
  );
  // 如果找到匹配项，返回对应的语言包编码，否则默认返回英语
  return matchedLang ? matchedLang.languagePack : 'en-US';
}
