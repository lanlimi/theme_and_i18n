
// 检查是否是移动设备,或者屏幕宽度小于 768px
export function checkIsMobile() {
    // 检查用户代理字符串是否包含移动设备的关键词
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ["android", "iphone", "ipad", "ipod", "windows phone"];
    // 如果包含任何一个关键词，就认为是移动设备
    const isMobile = mobileKeywords.some(keyword => userAgent.includes(keyword));
    const minWidth = window.matchMedia('(min-width: 768px)').matches;
    // 如果窗口宽度小于 768px，也认为是移动设备
    return isMobile || minWidth;
}
