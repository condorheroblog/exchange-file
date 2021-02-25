# 电脑手机互传文件

> 电脑和手机之间有个痛点就是文件互传，如何你经常在电脑上写作或办公感触应该挺深，例如写公众号的时候，我就经常遇到需要把手机的音视频上传到电脑上，如果使用第三方工具，例如微信或文叔叔等，麻烦速度还慢。自己动手丰衣足食。

### 环境要求

有 NodeJS 就行。

### 使用

第一步，根项目目录下打开终端运行命令：

```bash
npm install
```

第二步：终端继续输入命令

```bash
npm run start
```

此时终端出现网址，局域网下打开即可，上传的文件放到了 `upload` 文件下。


### 如何下载电脑上的文件

首页左滑即可进入到下载页面，在右滑即可回到首页。

在下载页面可以检测 download 文件夹发生变动，实时更新下载列表。