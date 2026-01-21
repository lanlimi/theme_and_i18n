import { action, makeAutoObservable, observable } from "mobx";

class AppStore {
  constructor() {
    makeAutoObservable(this);
  }

  themeType: 'light' | 'dark' | 'auto' = 'light';

  setThemeType(themeType: 'light' | 'dark' | 'auto') {
    this.themeType = themeType;
  }

}

const appStore = new AppStore();
export default appStore;