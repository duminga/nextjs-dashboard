# AGENT.md - 项目指南与开发指南

## 📋 目录

- [项目概述](#项目概述)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [项目架构](#项目架构)
- [核心概念](#核心概念)
- [开发指南](#开发指南)
- [数据库操作](#数据库操作)
- [最佳实践](#最佳实践)
- [常见任务](#常见任务)
- [故障排查](#故障排查)

---

## 项目概述

这是一个基于 **Next.js 15+** 构建的全栈仪表板应用程序，遵循 [Next.js 官方学习课程](https://nextjs.org/learn) 的最佳实践。该项目实现了一个完整的发票和客户管理系统，包含用户认证、数据库集成和完整的 CRUD 功能。

### 主要功能

- 📊 **仪表板视图**：展示收入图表、最新发票、统计卡片
- 💰 **发票管理**：创建、编辑、查看和管理发票
- 👥 **客户管理**：客户信息的展示和管理
- 🔐 **用户认证**：基于 NextAuth 5.0 的身份验证
- 🗄️ **数据库集成**：PostgreSQL 数据持久化
- 🎨 **响应式设计**：适配桌面端和移动端

---

## 技术栈

### 核心框架与语言
- **Next.js** `latest` - React 全栈框架（使用 App Router 和 Turbopack）
- **TypeScript** `5.7.3` - 类型安全的 JavaScript 超集
- **React** `latest` - UI 组件库

### 数据层
- **PostgreSQL** - 关系型数据库
- **postgres** `3.4.6` - PostgreSQL 客户端库

### 认证
- **NextAuth** `5.0.0-beta.25` - 身份验证解决方案
- **bcrypt** `5.1.1` - 密码加密

### UI 与样式
- **Tailwind CSS** `3.4.17` - 实用优先的 CSS 框架
- **@tailwindcss/forms** `0.5.10` - 表单样式插件
- **@heroicons/react** `2.2.0` - React 图标库
- **clsx** `2.1.1` - 条件类名工具

### 工具库
- **zod** `3.25.17` - TypeScript 优先的模式验证
- **use-debounce** `10.0.4` - React 防抖钩子

### 包管理
- **pnpm** - 快速、节省磁盘空间的包管理器

---

## 快速开始

### 环境要求

- Node.js 18.17 或更高版本
- pnpm 包管理器
- PostgreSQL 数据库

### 安装步骤

```bash
# 1. 克隆项目
git clone <repository-url>
cd nextjs-dashboard

# 2. 安装依赖
pnpm install

# 3. 配置环境变量
# 复制 .env.example 为 .env 并填写必要的配置
cp .env.example .env

# 4. 初始化数据库（首次运行）
# 启动开发服务器后，访问 http://localhost:3000/seed

# 5. 启动开发服务器
pnpm dev
```

### 必需的环境变量

在 `.env` 文件中配置以下变量：

```env
# PostgreSQL 数据库连接
POSTGRES_URL=              # 主数据库连接 URL
POSTGRES_PRISMA_URL=       # Prisma 兼容连接 URL
POSTGRES_URL_NON_POOLING=  # 非池化连接
POSTGRES_USER=             # 数据库用户名
POSTGRES_HOST=             # 数据库主机
POSTGRES_PASSWORD=         # 数据库密码
POSTGRES_DATABASE=         # 数据库名称

# 身份验证
AUTH_SECRET=               # 使用 openssl rand -base64 32 生成
AUTH_URL=http://localhost:3000/api/auth
```

### 可用命令

```bash
# 开发环境（使用 Turbopack 加速编译）
pnpm dev

# 生产构建
pnpm build

# 启动生产服务器
pnpm start
```

---

## 项目架构

### 目录结构详解

```
nextjs-dashboard/
├── app/                          # Next.js App Router 应用目录
│   ├── layout.tsx                # 根布局组件
│   ├── page.tsx                  # 首页路由
│   │
│   ├── dashboard/                # 仪表板路由组
│   │   ├── page.tsx              # /dashboard 路由页面
│   │   └── ...                   # 其他嵌套路由
│   │
│   ├── lib/                      # 共享工具和数据访问层
│   │   ├── definitions.ts        # TypeScript 类型定义
│   │   ├── data.ts               # 数据库查询函数
│   │   ├── utils.ts              # 工具函数
│   │   └── placeholder-data.ts   # 数据库种子数据
│   │
│   ├── ui/                       # UI 组件库
│   │   ├── global.css            # 全局样式
│   │   ├── fonts.ts              # 字体配置（Inter, Lusitana）
│   │   ├── dashboard/            # 仪表板组件
│   │   │   ├── cards.tsx         # 统计卡片
│   │   │   ├── latest-invoices.tsx  # 最新发票列表
│   │   │   ├── nav-links.tsx     # 导航链接
│   │   │   ├── revenue-chart.tsx # 收入图表
│   │   │   └── sidenav.tsx       # 侧边导航栏
│   │   ├── invoices/             # 发票相关组件
│   │   │   ├── create-form.tsx   # 创建发票表单
│   │   │   ├── edit-form.tsx     # 编辑发票表单
│   │   │   ├── table.tsx         # 发票表格
│   │   │   ├── status.tsx        # 状态徽章
│   │   │   ├── pagination.tsx    # 分页组件
│   │   │   ├── breadcrumbs.tsx   # 面包屑导航
│   │   │   └── buttons.tsx       # 操作按钮
│   │   └── customers/            # 客户相关组件
│   │       └── table.tsx         # 客户表格
│   │
│   ├── seed/                     # 数据库种子路由
│   │   └── route.ts              # GET /seed - 初始化数据库
│   │
│   └── query/                    # 查询测试路由
│       └── route.ts              # 数据库查询测试
│
├── public/                       # 静态资源
│   ├── customers/                # 客户头像
│   ├── hero-desktop.png          # 首页大图（桌面）
│   ├── hero-mobile.png           # 首页大图（移动）
│   └── favicon.ico               # 网站图标
│
├── .env.example                  # 环境变量示例
├── next.config.ts                # Next.js 配置
├── tailwind.config.ts            # Tailwind CSS 配置
├── tsconfig.json                 # TypeScript 配置
├── package.json                  # 项目依赖和脚本
├── CLAUDE.md                     # Claude AI 开发指南
└── AGENT.md                      # 本文档
```

### 架构模式

#### 1. 文件系统路由（App Router）

Next.js 15 使用文件系统路由，基于 `app/` 目录结构自动生成路由：

- `page.tsx` - 定义路由页面
- `layout.tsx` - 定义共享布局
- `route.ts` - 定义 API 路由处理器

**示例：**
```
app/dashboard/page.tsx        → /dashboard
app/dashboard/invoices/page.tsx → /dashboard/invoices
app/seed/route.ts             → /seed (API 路由)
```

#### 2. 数据访问层（app/lib/data.ts）

所有数据库查询集中在 `data.ts` 中，使用 `postgres` 包的标签模板语法：

```typescript
// 查询函数命名模式
export async function fetchRevenue() { ... }
export async function fetchLatestInvoices() { ... }
export async function fetchCardData() { ... }
```

**数据库连接配置：**
```typescript
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { 
  ssl: 'require'  // 生产环境需要 SSL
});
```

#### 3. 类型系统（app/lib/definitions.ts）

完整的 TypeScript 类型定义确保类型安全：

```typescript
// 核心数据模型
export type User = { id: string; name: string; email: string; password: string; }
export type Customer = { id: string; name: string; email: string; image_url: string; }
export type Invoice = { id: string; customer_id: string; amount: number; date: string; status: 'pending' | 'paid'; }
export type Revenue = { month: string; revenue: number; }

// 视图特定类型
export type InvoicesTable = { ... }
export type LatestInvoice = { ... }
export type FormattedCustomersTable = { ... }
```

#### 4. 组件组织原则

- **按功能分组**：组件按业务功能组织在 `app/ui/` 下
- **可复用性**：通用组件（按钮、搜索框等）放在 `app/ui/` 根目录
- **特定功能**：功能专属组件放在对应子目录（`dashboard/`、`invoices/`、`customers/`）

#### 5. 样式系统

- **Tailwind CSS**：使用工具类实现样式
- **条件样式**：使用 `clsx` 处理条件类名
- **自定义字体**：Google Fonts（Inter、Lusitana）在 `fonts.ts` 中配置
- **全局样式**：在 `global.css` 中定义

```typescript
import { clsx } from 'clsx';

// 条件类名示例
className={clsx(
  'flex items-center gap-2',
  { 'bg-blue-500': isActive },
  { 'bg-gray-200': !isActive }
)}
```

---

## 核心概念

### 1. 路径别名（Path Aliases）

项目配置了 `@/*` 别名映射到项目根目录，简化导入路径：

```typescript
// ✅ 推荐：使用路径别名
import { inter } from '@/app/ui/fonts';
import { fetchRevenue } from '@/app/lib/data';

// ❌ 避免：相对路径
import { inter } from '../../ui/fonts';
```

### 2. 服务器组件 vs 客户端组件

Next.js 15 默认所有组件都是服务器组件：

```typescript
// 服务器组件（默认）- 可以直接访问数据库
export default async function Page() {
  const revenue = await fetchRevenue();
  return <div>{revenue}</div>;
}

// 客户端组件 - 需要交互性
'use client';
export default function Button() {
  return <button onClick={() => alert('Clicked!')}>Click</button>;
}
```

### 3. 数据库模式

**核心表结构：**

- **users**：用户账户（UUID 主键、bcrypt 加密密码）
- **customers**：客户信息（姓名、邮箱、头像）
- **invoices**：发票记录（客户关联、金额、状态、日期）
- **revenue**：月度收入数据

**关键特性：**
- 使用 UUID 作为主键（`uuid-ossp` 扩展）
- 发票状态：`'pending' | 'paid'`（TypeScript 联合类型）
- 金额存储为整数（以分为单位，使用 `formatCurrency` 格式化）

### 4. 工具函数

**`app/lib/utils.ts` 提供的工具：**

```typescript
// 货币格式化（分 → 美元）
formatCurrency(2500) // "$25.00"

// 日期格式化
formatDateToLocal('2024-01-15', 'en-US') // "Jan 15, 2024"

// Y 轴刻度生成
generateYAxis(revenueData) // { yAxisLabels: ['$8K', '$7K', ...], topLabel: 8000 }

// 分页数组生成
generatePagination(3, 10) // [1, 2, 3, 4, '...', 9, 10]
```

---

## 开发指南

### 代码风格规范

#### TypeScript 类型

```typescript
// ✅ 推荐：显式类型注解
export async function fetchRevenue(): Promise<Revenue[]> {
  const data = await sql<Revenue>`SELECT * FROM revenue`;
  return data;
}

// ✅ 推荐：使用 lib/definitions.ts 中定义的类型
import { Invoice, Customer } from '@/app/lib/definitions';
```

#### 组件编写

```typescript
// ✅ 推荐：函数声明 + 类型注解
export default function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
```

#### 数据获取

```typescript
// ✅ 推荐：在服务器组件中直接获取数据
export default async function DashboardPage() {
  const revenue = await fetchRevenue();
  const latestInvoices = await fetchLatestInvoices();
  
  return (
    <div>
      <RevenueChart revenue={revenue} />
      <LatestInvoices invoices={latestInvoices} />
    </div>
  );
}
```

### 创建新页面的步骤

1. **创建页面文件**
```bash
# 示例：创建 /dashboard/customers 页面
touch app/dashboard/customers/page.tsx
```

2. **编写页面组件**
```typescript
import { fetchCustomers } from '@/app/lib/data';
import CustomersTable from '@/app/ui/customers/table';

export default async function CustomersPage() {
  const customers = await fetchCustomers();
  return <CustomersTable customers={customers} />;
}
```

3. **添加导航链接**
```typescript
// app/ui/dashboard/nav-links.tsx
const links = [
  { name: 'Customers', href: '/dashboard/customers', icon: UsersIcon },
];
```

### 添加新数据类型的步骤

1. **定义类型**（`app/lib/definitions.ts`）
```typescript
export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
};
```

2. **创建查询函数**（`app/lib/data.ts`）
```typescript
export async function fetchProducts(): Promise<Product[]> {
  const data = await sql<Product>`SELECT * FROM products`;
  return data;
}
```

3. **创建 UI 组件**（`app/ui/products/`）
```typescript
// app/ui/products/table.tsx
export default function ProductsTable({ products }: { products: Product[] }) {
  // ...
}
```

4. **更新数据库种子**（`app/seed/route.ts`）
```typescript
async function seedProducts() {
  await sql`CREATE TABLE IF NOT EXISTS products (...)`;
  // ...
}
```

### 样式开发技巧

#### Tailwind 常用模式

```typescript
// 响应式设计
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

// 悬停效果
<button className="bg-blue-500 hover:bg-blue-400 transition-colors">

// 条件样式
<span className={clsx(
  'inline-flex rounded-full px-2 text-xs',
  status === 'paid' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'
)}>
```

#### 自定义样式

```css
/* app/ui/global.css */
@layer components {
  .card {
    @apply rounded-xl bg-white p-6 shadow-sm;
  }
}
```

---

## 数据库操作

### 初始化数据库

**首次设置：**

1. 确保 PostgreSQL 已运行并配置好 `.env`
2. 启动开发服务器：`pnpm dev`
3. 访问种子路由：`http://localhost:3000/seed`

**种子路由会自动：**
- 创建所有必需的表
- 安装 `uuid-ossp` 扩展
- 插入示例数据（用户、客户、发票、收入）

### SQL 查询语法

项目使用 `postgres` 包的标签模板语法：

```typescript
import postgres from 'postgres';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// ✅ 参数化查询（防止 SQL 注入）
const user = await sql`
  SELECT * FROM users 
  WHERE email = ${email}
`;

// ✅ 复杂查询
const invoices = await sql`
  SELECT 
    invoices.id,
    invoices.amount,
    customers.name
  FROM invoices
  JOIN customers ON invoices.customer_id = customers.id
  WHERE invoices.status = ${status}
  ORDER BY invoices.date DESC
  LIMIT 5
`;
```

### 常用查询模式

```typescript
// 单条记录
const user = await sql`SELECT * FROM users WHERE id = ${id}`;
const userData = user[0]; // 返回数组，取第一个元素

// 多条记录
const invoices = await sql`SELECT * FROM invoices`;

// 聚合查询
const result = await sql`
  SELECT COUNT(*) as total, 
         SUM(amount) as sum 
  FROM invoices 
  WHERE status = 'paid'
`;
const { total, sum } = result[0];

// 事务
await sql.begin(async (sql) => {
  await sql`INSERT INTO users ...`;
  await sql`INSERT INTO invoices ...`;
});
```

---

## 最佳实践

### 性能优化

1. **使用服务器组件**：默认使用服务器组件减少客户端 JavaScript
2. **并行数据获取**：
```typescript
// ✅ 并行获取
const [revenue, invoices, customers] = await Promise.all([
  fetchRevenue(),
  fetchLatestInvoices(),
  fetchCardData(),
]);

// ❌ 串行获取（慢）
const revenue = await fetchRevenue();
const invoices = await fetchLatestInvoices();
```

3. **图片优化**：使用 Next.js `<Image>` 组件
```typescript
import Image from 'next/image';

<Image 
  src="/hero-desktop.png" 
  width={1000} 
  height={760} 
  alt="Dashboard" 
  priority // 首屏图片预加载
/>
```

### 安全性

1. **密码加密**：
```typescript
import bcrypt from 'bcrypt';
const hashedPassword = await bcrypt.hash(password, 10);
```

2. **SQL 注入防护**：使用参数化查询
```typescript
// ✅ 安全
await sql`SELECT * FROM users WHERE email = ${email}`;

// ❌ 危险（不要这样做）
await sql`SELECT * FROM users WHERE email = '${email}'`;
```

3. **环境变量**：敏感信息存储在 `.env` 中，不要提交到版本控制

### 类型安全

```typescript
// ✅ 使用泛型确保类型
const users = await sql<User[]>`SELECT * FROM users`;

// ✅ 导出带类型的函数
export async function fetchRevenue(): Promise<Revenue[]> {
  return await sql<Revenue[]>`SELECT * FROM revenue`;
}
```

### 代码组织

1. **单一职责**：每个组件只做一件事
2. **可复用性**：提取重复逻辑到 `lib/utils.ts`
3. **命名规范**：
   - 组件：`PascalCase`（`RevenueChart.tsx`）
   - 函数：`camelCase`（`fetchRevenue`）
   - 类型：`PascalCase`（`Invoice`）
   - 常量：`UPPER_SNAKE_CASE`

---

## 常见任务

### 添加新的发票状态

```typescript
// 1. 更新类型定义
export type Invoice = {
  // ...
  status: 'pending' | 'paid' | 'cancelled'; // 添加 'cancelled'
};

// 2. 更新状态徽章组件
export default function InvoiceStatus({ status }: { status: Invoice['status'] }) {
  return (
    <span className={clsx(
      'inline-flex items-center rounded-full px-2 py-1 text-xs',
      {
        'bg-gray-100 text-gray-500': status === 'pending',
        'bg-green-500 text-white': status === 'paid',
        'bg-red-500 text-white': status === 'cancelled', // 新增
      }
    )}>
      {status}
    </span>
  );
}
```

### 实现搜索功能

```typescript
// 客户端组件
'use client';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <input 
      type="text"
      onChange={(e) => handleSearch(e.target.value)}
      defaultValue={searchParams.get('query')?.toString()}
    />
  );
}
```

### 表单验证

```typescript
import { z } from 'zod';

// 定义验证模式
const InvoiceSchema = z.object({
  customerId: z.string({
    required_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

// 使用验证
export async function createInvoice(formData: FormData) {
  const validatedFields = InvoiceSchema.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
    date: formData.get('date'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 处理有效数据...
}
```

---

## 故障排查

### 常见问题

#### 数据库连接失败

**症状：**`Error: Connection refused`

**解决方案：**
1. 检查 PostgreSQL 是否运行
2. 验证 `.env` 中的数据库凭证
3. 确保数据库防火墙允许连接
4. 检查 SSL 设置（生产环境需要 `ssl: 'require'`）

#### 类型错误

**症状：**`Type 'X' is not assignable to type 'Y'`

**解决方案：**
1. 确保导入正确的类型：`import { Invoice } from '@/app/lib/definitions'`
2. 检查数据库返回的数据格式
3. 使用类型断言或类型守卫

#### 环境变量未加载

**症状：**`undefined` 或 `Cannot read property of undefined`

**解决方案：**
1. 重启开发服务器
2. 检查 `.env` 文件是否在项目根目录
3. 确保变量名以 `NEXT_PUBLIC_` 开头（客户端组件）
4. 服务器组件可以直接访问所有环境变量

### 调试技巧

```typescript
// 1. 服务器端日志
console.log('Data:', data); // 在终端查看

// 2. 数据库查询调试
const result = await sql`SELECT * FROM invoices`;
console.log('Query result:', result);

// 3. 类型检查
import type { Invoice } from '@/app/lib/definitions';
const invoice: Invoice = data; // 编译时检查类型
```

---

## 附录

### 有用的链接

- [Next.js 文档](https://nextjs.org/docs)
- [Next.js 学习课程](https://nextjs.org/learn)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)

### 项目维护

本项目基于 Next.js 官方学习课程构建，用于学习和实践目的。

---

**最后更新：** 2025-11-07  
**文档版本：** 1.0.0
