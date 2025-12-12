import { EventCenter } from './events/EventCenter';

/**
 * 应用上下文
 * 管理核心服务，提供依赖注入
 */
export class AppContext {
  public CONTEXT_ID = 'draw_space_context';

  private static _instance: AppContext | null = null;
  // 业务方的事件中心
  private _eventCenter: EventCenter;

  // 是否已初始化
  private _initialized: boolean = false;


  constructor() {
    this._eventCenter = new EventCenter();
  }

  /**
   * 获取默认实例
   */
  public static get instance(): AppContext {
    if (!AppContext._instance) {
      AppContext._instance = new AppContext();
    }
    return AppContext._instance;
  }



  /**
   * 初始化应用上下文
   */
  public async init(): Promise<void> {
    if (this._initialized) {
      return;
    }

    this._initialized = true;
  }


  /**
   * 获取事件中心
   */
  public get eventCenter(): EventCenter {
    return this._eventCenter;
  }


  /**
   * 检查是否已初始化
   */
  public get isInitialized(): boolean {
    return this._initialized;
  }

  /**
 * 重置默认实例
 */
  public reset(): void {
    if (AppContext._instance) {
      AppContext._instance.destroy();
      AppContext._instance = null;
    }
  }


  /**
   * 销毁应用上下文
   */
  public destroy(): void {
    this._eventCenter.destroy();

    this._initialized = false;
  }
}


export const appContext = AppContext.instance;
export const eventCenter = appContext.eventCenter;

// 将AppContext实例挂载到window对象上
declare global {
  interface Window {
    drawSpace: AppContext;
  }
}

window.drawSpace = appContext;
