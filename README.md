👉👉👉 This extension is still under development.

👉👉👉 JDK 1.8+ is required in your system.

# MLSQL Lang

MLSQL Lang is A Visual Studio Code extension that allows you to run MLSQL code in both  Script/Notebook  interface.

## Requirements

1. JDK 1.8+ is required in your system.
2. MLSQL Lang is only tested in MacOS/Linux though this extension works in Windows.


## Usage

1. Download extension from `http://download.mlsql.tech/mlsql-0.0.1.vsix` 
   
   * run command `code --install-extension mlsql-0.0.1.vsix`
   * Or Just open `mlsql-0.0.1.vsix` in vscode.

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

## Build-in Plugins

Excel/Shell is build-in support in this extention. You can load excel file like this:

![](docs/images/excel.png)

## Install Third-party Plugin

The plugins repo: [mlsql-plugins](https://github.com/allwefantasy/mlsql-plugins)

You can install them like this:

![](docs/images/plugin-install.png)



## Know Issues

If you reopen the project, when notebook is open before the mlsql-lang is activated,then 
the following error will happen:

![](docs/images/error.png)

Just close/open the notebook(.mlsqlnb) and everything goes Ok.


