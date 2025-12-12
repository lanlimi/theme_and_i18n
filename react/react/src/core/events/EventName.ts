// 事件名称常量
export const EventName = {
    TARGET_SELECTED: 'target:selected',
    // 点击价格设置弹窗中的柜体明细时，画布显示柜子的序列名
    SHOW_CABINET_NAME: 'show:cabinet:name',
    // 点击设计页顶部重选拼搭参数按钮或者用户信息页的新计划按钮时，显示拼搭页
    CREATE_PLAN: 'create:plan', 
    // 根据分享方案的类型，右侧显示不同的面板（灵感方案：门板换搭面板；普通方案：单元柜面板）
    SHOW_OTHER_PANEL: 'show:other:panel',
    // 保存拼搭方案
    SAVE_PLAN: 'save:plan',
  } as const;

  export type EventName = typeof EventName[keyof typeof EventName]; 