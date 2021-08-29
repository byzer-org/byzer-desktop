👉👉👉 This extension is still under development.

👉👉👉 JDK 1.8+ is required in your system.

# MLSQL Lang

MLSQL Lang is A Visual Studio Code extension that allows you to run MLSQL code in both  Script/Notebook  interface.

## Requirements

JDK 1.8+ is required in your system.

## Usage

1. Search `MLSQL` in Market, install it.
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

## build-plugins

Excel/Shell is build-in support in this extention. You can load excel file like this:

![](docs/images/excel.png)

## Know Issues

If you reopen the project, if notebook is open before the mlsql-lang is activated,then 
the following error will happen.

![](docs/images/error.png)

Just reopen the notebook(.mlsqlnb) and everything goes Ok.


