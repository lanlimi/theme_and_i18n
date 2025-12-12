import EventEmitter from 'eventemitter3';

export type EventHandler = (...args: any[]) => void;

/**
 * 事件中心
 * 基于 EventEmitter3 实现，提供应用层的事件管理
 * 同时集成 PIXI.js 事件管理功能
 */
export class EventCenter {
  private _emitter: EventEmitter;
  private _isInitialized: boolean = false;

  constructor() {
    this._emitter = new EventEmitter();
  }

  /**
   * 检查是否已初始化
   */
  public isInitialized(): boolean {
    return this._isInitialized;
  }

  // ========== 通用事件方法 ==========
  
  /**
   * 监听事件
   * @param eventName 事件名称
   * @param handler 事件处理函数，支持接收任意数量的参数
   */
  on(eventName: string, handler: EventHandler): void {
    this._emitter.on(eventName, handler);
  }

  /**
   * 监听事件（只执行一次）
   * @param eventName 事件名称
   * @param handler 事件处理函数，支持接收任意数量的参数
   */
  once(eventName: string, handler: EventHandler): void {
    this._emitter.once(eventName, handler);
  }

  /**
   * 移除事件监听
   * @param eventName 事件名称
   * @param handler 可选的事件处理函数，如果不提供则移除该事件的所有监听器
   */
  off(eventName: string, handler?: EventHandler): void {
    if (handler) {
      this._emitter.off(eventName, handler);
    } else {
      this._emitter.off(eventName);
    }
  }

  /**
   * 发射事件
   * @param eventName 事件名称
   * @param args 传递给事件处理函数的参数，支持任意数量和类型
   */
  emit(eventName: string, ...args: any[]): void {
    this._emitter.emit(eventName, ...args);
  }

  // ========== 工具方法 ==========

  /**
   * 获取事件监听器数量
   * @param eventName 事件名称
   */
  listenerCount(eventName: string): number {
    return this._emitter.listenerCount(eventName);
  }

  /**
   * 移除所有事件监听
   * @param eventName 可选的事件名称，如果不提供则移除所有事件的监听器
   */
  removeAllListeners(eventName?: string): void {
    this._emitter.removeAllListeners(eventName);
  }

  /**
   * 销毁事件总线
   */
  destroy(): void {
    this._emitter.removeAllListeners();
    this._isInitialized = false;
  }
} 