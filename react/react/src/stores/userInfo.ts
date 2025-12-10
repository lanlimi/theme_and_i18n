import { action, makeAutoObservable, observable } from "mobx";


interface UserInfo {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  role: string;
}

class UserInfoStore {
  constructor() {
    makeAutoObservable(this);
  }

  userInfo: UserInfo = {
    id: '',
    name: '',
    avatar: '',
    email: '',
    phone: '',
    role: '',
  };

  setUserInfo(userInfo: UserInfo) {
    this.userInfo = userInfo;
  }
}

const userInfoStore = new UserInfoStore();
export default userInfoStore;