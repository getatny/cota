![cota](https://raw.githubusercontent.com/wiki/getatny/cota/cota-github-logo.png)

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
yarn i:yarn # 安装server及admin所需依赖，npm需要使用npm run i:npm
yarn export:prod # 导出静态资源，测试环境下可使用yarn export:dev，将会有完整的error信息显示
yarn migrate # 创建数据库，添加默认admin账号 cota-admin / cota-admin (请记得修改密码)
yarn start # 默认该server会启动到localhost:4444，你可以通过nginx进行反向代理提供公网访问
```

这样 `Cota` server及静态资源就准备好了，后面还需要做最后一步操作，将评论框注入你需要评论服务的页面。

要实现评论框注入，你需要准备一个容纳评论框的节点，并且该节点拥有唯一的id。（例如：`<div id="cota"></div>`）

之后引入 `cota.min.js` 并实例化 `Cota` 对象，传入你准备好的容纳评论框的id即可：

```html
<script src="http://localhost:4444/cota.min.js"></script>
<!-- 如果注入节点id为cota，则可省去el参数。具体参数配置请参考后面配置部分 -->
<script>
    new Cota({
        el: 'cota',
        lang: 'zh_CN'
    });
</script>
```

刷新页面，即可看到 cota 注入成功！

## 配置

通过以上操作，你可以快速启动一个 cota 评论系统程序，但是为了系统的正常运行，你还需要根据需要根据你的需求修改一些配置文件：

简单来说，配置文件分为两个部分：

1. `src/config.json` 中用于设置server端表现的配置文件
2. 在实例化 `Cota` 对象时传入的options

### src/config.json

打开 `src/config.json` 文件你可以看到几个配置项，其中 `whiteList` 指定了能够通过 cota 暴露的 api 访问评论资源的域名，一般来说需要设置两个，一个是 cota server 启动的域名，另一个是被注入 cota 评论系统的网页域名。

`jwtSecret` 字段设置的字符串，将被作为 server 生成授权 token 时的密匙，根据自己的需要设置即可。

`trustThreshold` 字段用于自动审核评论，当一条评论产生的时候，默认（0）是需要手动审核之后才能在评论列表中显示的，将该字段设置为任何大于0的值即打开自动信任模式，用户的前N次（你设置的值）评论还是需要你手动审核，但当被审核通过的评论数量达到设置的值时，该用户将被加入可信名单，以后该用户所有的评论都将无审核直接显示在评论列表中！

### new Cota(options)

在实例化 `Cota` 对象的的时候，你可以传入一个对象改变其默认配置：（所有配置都不是必须的，如果你的注入节点id是cota的话）

|字段|参数类型|作用|默认值|
|:------:|:------:|:------:|:------:|
|`el`|string|设置输入框注入节点(id)|cota|
|`avatarMirror`|string|gravatar头像CDN|gravatar.loli.net|
|`defaultAvatar`|string|用户没有自定义头像时显示的默认头像|'mm'|
|`pageSize`|number|每页评论数|10|
|`lang`|string|显示语言|en|
|`emailNotify`|boolean|是否开启邮件提醒|false|
|`notifyStatus`|boolean|默认邮件提醒状态（在邮件提醒功能开启状态下，用户可自行选择是否提醒）|false|

## 管理后台

```bash
yarn build # 构建后台静态文件，静态文件将会生成到项目根目录下admin-public中
```

运行以上命令，在你成功部署 `Cota` 服务之后，可以直接通过 `http://localhost:4444` 访问cota提供的管理后台。默认的账号 / 密码为： cota-admin / cota-admin

## 自定义？

如果你在使用中发现有什么逻辑 / 样式不符合你需求的地方，并且你有一定的 Javascript 语言基础，那你完全可以根据你自己的需求修改源代码。本项目主要分为三个个部分：

- 提供数据获取 / 操作 api 的 server 端 （src）
- 管理评论的 admin GUI （src/admin）
- 将评论框 + 数据注入指定网页的 js / css 资源 （src/static）

其中，GUI 和 静态资源在压缩后分别被放在了根目录下的 admin-public 和 dist 文件夹下，并通过 koa-static 提供了对应静态资源的访问。
