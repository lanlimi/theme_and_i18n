import { useColorToken } from "@/hooks/useColorToken";
import { useSizeToken } from "@/hooks/useSizeToken";
import { createStyles } from "antd-style";

/**
 * 增强版的 createStyles 函数，自动将 sizeToken, colorToken 合并到 token 中
 * @param styleFunction 样式函数，接收 token（包含 sizeToken, colorToken）和 css 参数
 * @returns 返回 createStyles 的结果
 */
export function customCreateStyles(styleFunction: (params: { token: any, css: any }) => Record<string, any>) {
    return createStyles(({ token, css }) => {
        const sizeToken = useSizeToken();
        const colorToken = useColorToken();
        const extendedToken = { ...token, ...sizeToken, ...colorToken };
        return styleFunction({ token: extendedToken, css });
    });
}