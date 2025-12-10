import { action, makeAutoObservable, observable } from "mobx";

class AppStore {
  constructor() {
    makeAutoObservable(this);
  }

  themeType: 'light' | 'dark' = 'light';

  setThemeType(themeType: 'light' | 'dark') {
    this.themeType = themeType;
  }

}

const appStore = new AppStore();
export default appStore;