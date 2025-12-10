import React from "react";
import userInfo from "./userInfo";
import appStore from "./appStore";

export const userInfoContext = React.createContext(userInfo);
export const appStoreContext = React.createContext(appStore);

/**
 * @description 用户信息数据
 */
export const useUserInfo = () => React.useContext(userInfoContext);

/**
 * @description 应用状态管理数据
 */
export const useAppStore = () => React.useContext(appStoreContext);

class RootStore {
  userInfo = userInfo;
  appStore = appStore;
  constructor() {
    // 对子模块进行实例化操作
  }
}

const rootStore = new RootStore();
const context = React.createContext(rootStore);

const useStore = () => React.useContext(context);

export { useStore };
