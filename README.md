# 将html中的uri批量智能转换成定制的的urn + uri前缀

### 安装:

```
    git clone github.com:doc2git/html-uri--relative2protocal.git
    npm i
```
## 使用案例:

### 使用案例一:

*触发命令：*
```
    node replaceInAllHtml.js
```


关键触发源码(in replaceInAllHtml)：

```
    var replaceRelativeUriToProtocalUriInHtml = require('./index.js');
    var uriReplaceSrcList = require('./uriReplaceSrcList.js');
    replaceRelativeUriToProtocalUriInHtml('http://localhost:3378/a/b/c/d/e/f/g', ...uriReplaceSrcList);
```

*'./uriReplaceSrcList.js'*快速生成方式：

```
    find test-dir -type f | grep '\index\.html' > ./uriReplaceSrcList.js
```



![](/images/多传入一个文件名参数.png)

### 使用案例二：

*触发命令：*
```
    find test-dir -type f |  grep '\index.html\|test\.html' | xargs node index.js 'http://localhost:3354/a/b/c/d/e/f/g/h'
```
生成的目录结构变更：　


![](/images/少传入一个文件名参数.png))

因为多向 *node index.js* 传了一个 *test.html*，
'(... ｜　grep　...)'，所以输出多输出了test<标记名>.html