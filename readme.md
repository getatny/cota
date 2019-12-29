# Cota - Small comment system

Cota 是一个使用Javascript语言编写的，以 sqlite 作为数据存储的小型评论系统。该系统部署简单，只需简单添加一个 js 脚本及一个 DOM 节点即可将其融入已有网页。

- 服务端： Koa + sqlite
- 管理页面： React

## 快速开始

首先，你需要通过一下命令克隆本项目，并安装 server 程序启动所需要的所有依赖、建立 sqlite 数据库及默认 admin 账号：
> ps. 我使用 yarn 管理依赖包，如果你没有安装 yarn，请使用 npm 替换下列命令中所有的 yarn 关键字！

```bash
git clone git@github.com:getatny/cota.git
cd cota
yarn install
yarn migrate
yarn start
```

## 配置

通过以上操作，你可以快速启动一个 cota 评论系统程序，但是为了系统的正常运行，你还需要根据需要修改配置文件：

打开 `src/config.js` 文件你可以看到几个配置项，每个配置项的作用有对应注释说明，其中 `whiteList` 指定了能够通过 cota 暴露的 api 访问评论资源的域名，一般来说需要设置两个，一个是 cota server 启动的域名，另一个是被注入 cota 评论系统的网页域名。

`jwtSecret` 字段设置的字符串，将被作为 server 生成授权 token 时的密匙，根据自己的需要设置即可。

## 自定义？

如果你在使用中发现有什么逻辑 / 样式不符合你需求的地方，并且你有一定的 Javascript 语言基础，那你完全可以根据你自己的需求修改源代码。本项目主要分为三个个部分：

- 提供数据获取 / 操作 api 的 server 端 （src）
- 管理评论的 admin GUI （src/admin）
- 将评论框 + 数据注入指定网页的 js / css 资源 （src/static）

其中，GUI 和 静态资源在压缩后分别被放在了根目录下的 admin-public 和 dist 文件夹下，并通过 koa-static 提供了对应静态资源的访问。