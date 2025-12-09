import { useColorToken } from "@/hooks/useColorToken";
import { useSizeToken } from "@/hooks/useSizeToken";
import { createStyles } from "antd-style";


/**
 * CSS 工具函数类型定义
 * 用于处理模板字符串和 CSS 插值
 * 返回 SerializedStyles 类型，与 antd-style 包兼容
 */
export interface CssUtil {
  (template: TemplateStringsArray, ...args: any[]): any; // SerializedStyles
  (...args: any[]): any; // SerializedStyles
}
/**
 * 增强版的 createStyles 函数，自动将 sizeToken, colorToken 合并到 token 中
 * @param styleFunction 样式函数，接收 token（包含 sizeToken, colorToken）和 css 参数
 * @returns 返回 createStyles 的结果
 */
export function customCreateStyles(
    styleFunction: (params: { token: any, css: CssUtil }) => Record<string, any>
) {
    return createStyles(({ token, css }) => {
        const sizeToken = useSizeToken();
        const colorToken = useColorToken();
        // 将 sizeToken, colorToken 合并到 token 中
        const extendedToken = { ...token, ...sizeToken, ...colorToken };
        return styleFunction({ token: extendedToken, css });
    });
}