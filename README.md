👉👉👉 This extension is still under development.

👉👉👉 JDK 1.8+ is required in your system.

# mlsql-Lang

mlsql-lang is a Visual Studio Code extension that allows you to run MLSQL code in both  Script/Notebook  interface.

### Current Version

v0.0.5

### v0.0.5 

* ✅  Fix opening .mlsqlnb do not trigger mlsql language server

### v0.0.4 

* ✅  More control parameters on engine
* ✅  New include type `project` is support
* ✅  !pyInclude also support `project` type.
* ✅  Support html/png renderer in notebook mode.
* ✅  More mlsql code examples  
    
    * [mlsql-lang-example-project/github](https://github.com/allwefantasy/mlsql-lang-example-project)
    * [mlsql-lang-example-project/gitee](https://gitee.com/allwefantasy/mlsql-lang-example-project)


### v0.0.3 

* ✅ mlsql-lang grammar highlight
* ✅ Better table renderer
* ✅ mlsql-lang code autocomplete


## Requirements

1. JDK 1.8+ is required in your system. [JDK8-Mac ](https://www.openlogic.com/openjdk-downloads?field_java_parent_version_target_id=416&field_operating_system_target_id=431&field_architecture_target_id=391&field_java_package_target_id=396)/[JDK8-Linux](https://www.openlogic.com/openjdk-downloads?field_java_parent_version_target_id=416&field_operating_system_target_id=426&field_architecture_target_id=391&field_java_package_target_id=396)
2. [Visuial Studio Code](https://code.visualstudio.com/)

## Limitation

mlsql-lang is only tested in MacOS/Linux though this extension works in Windows.

## Installation

### Install From Local

> this extension contains mlsql-lang already.

Download extension from `https://mlsql-downloads.kyligence.io/2.1.0/mlsql-0.0.5.vsix`  or `http://download.mlsql.tech/mlsql-0.0.5.vsix`

   
   * run command `code --install-extension mlsql-0.0.5.vsix`
   * Or Just open `mlsql-0.0.5.vsix` in vscode in market panel

[](https://mlsql-docs.kyligence.io/latest/zh-hans/howtouse/images/img_local_install.png)   

### Install From Market

1. Search `mlsql` in market and install it.
2. Download mlsql-lang from `https://mlsql-downloads.kyligence.io/2.1.0/` 
3. Extract mlsql-lang and configure the path by `engine.home` in `.mlsq.config`.

### Others

[MLSQL 桌面版使用 (Mac/Linux)](https://mlsql-docs.kyligence.io/latest/zh-hans/howtouse/mlsql_desktop_install.html)

## Usage

1. Install extension.
2. Create a directory, then open it with Visual Studio Code.
3. File extensions `.mlsql` or `.mlsqlnb` are supported.
4. Once you open a mlsql file, the extension will be activated.

![](docs/images/activate.png)

5. If not auto activate, click right left corner and click language select button, choose MLSQL.
7. Open command `MLSQL: run` to execute MLSQL script:

 ![](docs/images/run.png)
 ![](docs/images/script.png)

8. Here is notebook example:

![](docs/images/notebook.png)

## Example project

1. [mlsql-lang-example-project/github](https://github.com/allwefantasy/mlsql-lang-example-project)
2. [mlsql-lang-example-project/gitee](https://gitee.com/allwefantasy/mlsql-lang-example-project)

## Restart mlsql lang language server

Run command in vscode:  Developer: Reload Window

## Congiguration (>= 0.0.2)

You can configure MLSQL Lang server with file `.mlsql.config`  in your project (root path).

For example:

```
engine.home=...../mlsql-lang/mlsql-app_2.4-2.1.0-SNAPSHOT
engine.url=http://127.0.0.1:9003
engine.owner=admin
engine.memory=2048m

user.access_token=123
```


## Build-in Plugins

Excel/Shell is build-in support in this extention. You can load excel file like this:

![](docs/images/excel.png)

## Install Third-party Plugin

The plugins repo: [mlsql-plugins](https://github.com/allwefantasy/mlsql-plugins)

You can install them like this:

![](docs/images/plugin-install.png)



## Know Issues

### .mlsqlnb have no plugin for it ( <=v0.0.4)

If you reopen the project, when notebook is open before the mlsql-lang is activated,then 
the following error will happen:

![](docs/images/error.png)

Just close/open the notebook(.mlsqlnb) and everything goes Ok.

### mlsql lang server fails to quit when your workspace closed ( <= v0.0.3)

Sometimes the lang server will not quit properly when you close your workspace.
Try using flowing command to find the pid and kill it.

```
ps -ef |grep 'tech.mlsql.plugins.langserver.launchers.stdio.Launcher'
```

