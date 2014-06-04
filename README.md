#Node Ace Editor

##介绍
使用node-webkit封装ace编辑器。

使用了：

1. ace.js
2. require.js
3. artTemplate.js
4. jquery
5. bootstrap

##安装

```
npm install

```


##编译

修改Gruntfile.js设置需要编译的版本。

```
grunt.initConfig({
      nodewebkit: {
          options: {
              build_dir: './build', 
              credits: './src/credits.html',
              mac: true, // build it for mac
              win: false, // build it for win
              linux32: false, // build it for linux32
              linux64: false, // build it for linux64
          },
          src: './src/**/*' 
      },
    });

```

输入`grunt`进行编译，编译后的版本会在build目录下。

## 不编译运行

直接输入`nw src [filename]`运行。

## 截图
![image](http://git.oschina.net/nov_eleven/photo/raw/master/nodeace.png)

## 后续任务

1. 添加右键菜单。
2. 添加快捷键。
3. markdown编辑实时预览。