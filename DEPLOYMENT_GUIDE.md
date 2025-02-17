# Maskly 部署指南

## 环境要求
```bash
# 基础依赖
Node.js 18.x+
Docker 20.10+
Python 3.8+ (仅用于合约验证)
Solidity 0.8.20+ 

# 全局安装工具
npm install -g hardhat@2.12.7 typechain@8.1.2
```

## 配置文件设置
创建 `.env` 文件（基于.env.example）：
```ini
# 区块链配置
ETH_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
BSC_RPC_URL=https://bsc-dataseed.binance.org

# 合约部署者账户
DEPLOYER_PRIVATE_KEY=your_private_key
VERIFY_CONTRACTS=true

# 后端配置
DATABASE_URL=postgresql://user:pass@localhost:5432/maskly
IPFS_API_URL=/ip4/127.0.0.1/tcp/5001
```

## 智能合约部署
### 多链部署流程
```bash
# 部署核心合约（按顺序执行）
npx hardhat run scripts/deployment/deployBridge.js --network ethereum
npx hardhat run scripts/deployment/deployQUA.js --network solana
npx hardhat run scripts/deployment/deployMaskBTC.js --network bsc

# 验证合约（需要对应网络的API key）
npx hardhat verify --network ethereum 0xContractAddress
npx hardhat verify --network solana --program-id YOUR_PROGRAM_ID
```

## 后端服务部署
```bash
# 启动依赖服务
docker-compose up -d postgres redis ipfs

# 安装依赖 & 启动
cd maskly/backend
npm ci
npm run migrate:prod
pm2 start server.js --name "maskly-api"
```

## 前端部署
### Web dApp
```bash
cd maskly/frontend/dapp
npm ci
npm run build
serve -s build -l 3000
```

### 移动端构建
```bash
# Android
cd maskly/frontend/app
npm ci
npx react-native run-android --variant=release

# iOS
cd ios
pod install
xcodebuild -workspace MasklyApp.xcworkspace -scheme MasklyApp -configuration Release
```

## 监控配置
```bash
# 部署Prometheus+Grafana
docker-compose -f monitoring/docker-compose.yml up -d

# 配置Sentry
export SENTRY_DSN=your_dsn
npm run sentry:inject
```

## 安全审计
```bash
# 运行智能合约扫描
npx slither --config security/slither-config.json

# 启动网络监控
node security/monitoring/chainalysis/anomalyDetection.js
```

## 部署验证
```bash
# 运行集成测试
npm run test:integration

# 检查服务状态
curl http://localhost:3000/api/v1/health
npx hardhat check-contracts --network all
```

## 常见问题
### 合约验证失败
1. 确认编译器版本匹配
2. 检查构造函数参数格式
3. 确保网络RPC节点同步完成

### 跨链交易超时
1. 检查适配器服务状态
2. 验证目标链Gas价格
3. 查看事件监听器日志

### 数据库连接问题
1. 确认PostgreSQL服务运行中
2. 检查.env文件权限
3. 验证迁移脚本执行结果

## 更新维护
```bash
# 滚动更新后端
pm2 reload maskly-api --update-env

# 合约升级流程
1. 部署新版本合约
2. 执行数据迁移
3. 更新前端ABI引用
4. 切换代理合约路由
