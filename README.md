# scdt-intervew

使用 TypeORM，ioredis，express 实现的短域名服务

### 安装依赖

    npm install

### 开发

    npm run dev

### 生产

    npm run start

### 单元测试以及覆盖率查看

    npm run test

## 接口信息

### POST /api/url/short

    { url: string }

接收长链接，返回短链接

### GET /api/url/origin

    { url: string }

接收短链接，返回长链接
