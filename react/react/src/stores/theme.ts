import ColorLightToken from '@/assets/customToken/Color.Light.token.json'
import ColorDarkToken from '@/assets/customToken/Color.Dark.token.json'
import Size1920Token from '@/assets/customToken/Size.1920.token.json'
import Size1336Token from '@/assets/customToken/Size.1336.token.json'
import textStylesToken from '@/assets/customToken/text.styles.token.json'
import { checkIsMobile } from '@/utils/equipment';
import { makeAutoObservable } from 'mobx';


class ThemeStore {
    theme: 'light' | 'dark' = 'light';
    size: number = 1920;

    // mobx6.0后必须加上这一句，
    // MobX 6.0 引入了 架构性变化 ，装饰器（如 @observable 、 @action ）不再自动使类成员响应式
    // ，而是需要显式调用 makeObservable(this) 或 makeAutoObservable(this) 来完成响应式转换
    constructor() {
        makeAutoObservable(this);
    }

    setTheme(theme: 'light' | 'dark') {
        this.theme = theme;
    }

    setSize(size: number) {
        this.size = size;
    }

    get colorToken() {
        return this.theme === 'light' ? ColorLightToken : ColorDarkToken;
    }

    get sizeToken() {
        // 这个打印不要删除和注释！！！
        // 解决了使用浏览器开发者工具将窗口切换到ipad模式后，再切回pc模式时，更改窗口大小 sizeToken() 方法失效的bug
        // 原理是 sizeToken这个getter方法与size属性之间的依赖关系在某些情况下（如设备模式切换）被意外中断
        // 而使用 console.log 访问 this.size 可以强制重新建立依赖关系，即使在依赖链被破坏的情况下，也能重新触发 sizeToken 的重新计算
        console.log('窗口大小：', this.size);
        // 这里应该添加设备判断，凡是移动端设备都用 1336 尺寸
        if (checkIsMobile()) {
            return Size1336Token;
        }
        return this.size <= 1336 ? Size1336Token : Size1920Token;
    }

    get textStylesToken() {
        return textStylesToken
    }

}

const themeStore = new ThemeStore();
export default themeStore;