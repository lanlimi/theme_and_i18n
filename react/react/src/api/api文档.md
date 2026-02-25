# 日程管理系统 API 文档

## 1. 认证相关接口 (authApi)

### 1.1 注册接口
**功能**：注册新用户

**请求信息**
- **方法**：POST
- **路径**：/auth/register
- **类型**：JSON

**请求参数**
| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| username | string | ✅ | 用户名 |
| password | string | ✅ | 密码 |
| email | string | ✅ | 邮箱 |

**响应格式**
```typescript
{
  message: string;  // 操作结果信息
  user: {
    id: number;     // 用户ID
    username: string; // 用户名
    email: string;    // 邮箱
    created_at: string; // 创建时间
    updated_at: string; // 更新时间
  }
}
```

**使用示例**
```typescript
const response = await authApi.register({
  username: "testuser",
  password: "123456",
  email: "test@example.com"
});
```

---

### 1.2 登录接口
**功能**：用户登录并获取认证令牌

**请求信息**
- **方法**：POST
- **路径**：/auth/login
- **类型**：JSON

**请求参数**
| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| username | string | ✅ | 用户名 |
| password | string | ✅ | 密码 |

**响应格式**
```typescript
{
  message: string;  // 操作结果信息
  token: string;    // JWT认证令牌
  user: {
    id: number;     // 用户ID
    username: string; // 用户名
    email: string;    // 邮箱
    created_at: string; // 创建时间
    updated_at: string; // 更新时间
  }
}
```

**使用示例**
```typescript
const response = await authApi.login({
  username: "testuser",
  password: "123456"
});
// 存储token到本地存储
localStorage.setItem('token', response.token);
```

---

## 2. 日程相关接口 (scheduleApi)

### 2.1 获取日程列表
**功能**：获取用户的日程列表，支持分页和多条件查询

**请求信息**
- **方法**：GET
- **路径**：/schedules
- **类型**：查询参数

**请求参数**
| 参数名 | 类型 | 必填 | 默认值 | 描述 |
|--------|------|------|--------|------|
| page | number | ❌ | 1 | 页码 |
| per_page | number | ❌ | 10 | 每页数量 |
| status | string | ❌ | - | 状态过滤（pending/in_progress/completed） |
| priority | string | ❌ | - | 优先级过滤（high/medium/low） |
| title | string | ❌ | - | 标题模糊查询 |

**响应格式**
```typescript
{
  schedules: [
    {
      id: number;         // 日程ID
      user_id: number;     // 用户ID
      title: string;       // 日程标题
      description: string; // 日程描述
      start_time: string;  // 开始时间
      end_time: string;    // 结束时间
      priority: string;    // 优先级
      status: string;      // 状态
      created_at: string;  // 创建时间
      updated_at: string;  // 更新时间
    }
  ],
  total: number;         // 总记录数
  pages: number;         // 总页数
  current_page: number;  // 当前页码
}
```

**使用示例**
```typescript
// 基本查询
const response = await scheduleApi.getSchedules();

// 带分页和标题查询
const response = await scheduleApi.getSchedules({
  title: "会议",
  page: 1,
  per_page: 10
});

// 带状态过滤
const response = await scheduleApi.getSchedules({
  status: "pending",
  page: 1,
  per_page: 10
});
```

---

### 2.2 获取单个日程
**功能**：获取指定ID的日程详情

**请求信息**
- **方法**：GET
- **路径**：/schedules/{id}
- **类型**：路径参数

**请求参数**
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | number | ✅ | 日程ID |

**响应格式**
```typescript
{
  schedule: {
    id: number;         // 日程ID
    user_id: number;     // 用户ID
    title: string;       // 日程标题
    description: string; // 日程描述
    start_time: string;  // 开始时间
    end_time: string;    // 结束时间
    priority: string;    // 优先级
    status: string;      // 状态
    created_at: string;  // 创建时间
    updated_at: string;  // 更新时间
  }
}
```

**使用示例**
```typescript
const response = await scheduleApi.getSchedule(1);
console.log('日程详情:', response.schedule);
```

---

### 2.3 创建日程
**功能**：创建新的日程

**请求信息**
- **方法**：POST
- **路径**：/schedules
- **类型**：JSON

**请求参数**
| 字段名 | 类型 | 必填 | 默认值 | 描述 |
|--------|------|------|--------|------|
| title | string | ✅ | - | 日程标题 |
| description | string | ❌ | - | 日程描述 |
| start_time | string | ✅ | - | 开始时间（ISO格式字符串） |
| end_time | string | ✅ | - | 结束时间（ISO格式字符串） |
| priority | string | ❌ | "medium" | 优先级（high/medium/low） |
| status | string | ❌ | "pending" | 状态（pending/in_progress/completed） |

**响应格式**
```typescript
{
  message: string;  // 操作结果信息
  schedule: {
    id: number;         // 日程ID
    user_id: number;     // 用户ID
    title: string;       // 日程标题
    description: string; // 日程描述
    start_time: string;  // 开始时间
    end_time: string;    // 结束时间
    priority: string;    // 优先级
    status: string;      // 状态
    created_at: string;  // 创建时间
    updated_at: string;  // 更新时间
  }
}
```

**使用示例**
```typescript
const response = await scheduleApi.createSchedule({
  title: "团队会议",
  description: "每周团队周会",
  start_time: "2026-03-01T09:00:00",
  end_time: "2026-03-01T10:00:00",
  priority: "high",
  status: "pending"
});
```

---

### 2.4 更新日程
**功能**：更新现有日程

**请求信息**
- **方法**：PUT
- **路径**：/schedules/{id}
- **类型**：JSON

**请求参数**
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | number | ✅ | 日程ID |
| title | string | ❌ | 日程标题 |
| description | string | ❌ | 日程描述 |
| start_time | string | ❌ | 开始时间（ISO格式字符串） |
| end_time | string | ❌ | 结束时间（ISO格式字符串） |
| priority | string | ❌ | 优先级（high/medium/low） |
| status | string | ❌ | 状态（pending/in_progress/completed） |

**响应格式**
```typescript
{
  message: string;  // 操作结果信息
  schedule: {
    id: number;         // 日程ID
    user_id: number;     // 用户ID
    title: string;       // 日程标题
    description: string; // 日程描述
    start_time: string;  // 开始时间
    end_time: string;    // 结束时间
    priority: string;    // 优先级
    status: string;      // 状态
    created_at: string;  // 创建时间
    updated_at: string;  // 更新时间
  }
}
```

**使用示例**
```typescript
const response = await scheduleApi.updateSchedule(1, {
  title: "重要团队会议",
  status: "in_progress"
});
```

---

### 2.5 删除日程
**功能**：删除指定ID的日程

**请求信息**
- **方法**：DELETE
- **路径**：/schedules/{id}
- **类型**：路径参数

**请求参数**
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | number | ✅ | 日程ID |

**响应格式**
```typescript
{
  message: string;  // 操作结果信息
}
```

**使用示例**
```typescript
const response = await scheduleApi.deleteSchedule(1);
```

---

## 3. 通用说明

### 3.1 认证机制
- 所有日程相关接口都需要在请求头中携带认证令牌
- 令牌格式：`Authorization: Bearer {token}`
- 令牌有效期：7天

### 3.2 错误处理
- **400 Bad Request**：请求参数错误
- **401 Unauthorized**：认证失败或未认证
- **404 Not Found**：资源不存在
- **500 Internal Server Error**：服务器内部错误

### 3.3 时间格式
- 所有时间字段均使用 ISO 8601 格式：`YYYY-MM-DDTHH:MM:SS`

### 3.4 数据隔离
- 每个用户只能访问自己的日程数据
- 系统会根据 JWT 令牌中的用户ID自动过滤数据

---

## 4. 代码引用

### 4.1 导入API
```typescript
import { authApi, scheduleApi } from '@/api';
```

### 4.2 完整使用示例
```typescript
// 登录并获取令牌
const loginResponse = await authApi.login({
  username: "testuser",
  password: "123456"
});
localStorage.setItem('token', loginResponse.token);

// 创建日程
const createResponse = await scheduleApi.createSchedule({
  title: "测试日程",
  start_time: new Date().toISOString(),
  end_time: new Date(Date.now() + 3600000).toISOString()
});

// 查询日程列表
const listResponse = await scheduleApi.getSchedules({
  title: "测试"
});

// 更新日程
const updateResponse = await scheduleApi.updateSchedule(createResponse.schedule.id, {
  title: "更新后的日程"
});

// 删除日程
const deleteResponse = await scheduleApi.deleteSchedule(createResponse.schedule.id);
```