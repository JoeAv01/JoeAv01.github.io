---
title : Fundamental Scoop Guide
weight : 10
--- 

**——by 保登心爱**

我将整个教程分为了两个部分：基础篇与进阶篇。本篇为基础篇。

本教程主要面向有相关计算机开发需求的同学。
本教程默认你：
- 对命令行有最基础的了解，并熟悉 powershell
- 掌握一定的科学上网技术，以解决连接超时问题

> [Scoop 的网站](https://scoop.sh/)  
> [Scoop 的 GitHub 网址](https://github.com/ScoopInstaller/Scoop)


{{< spacer >}}
## 简介
你是否遇到过以下问题：
- 下载软件时到处寻找官网和安装包 
- 配置 PATH、环境变量经常出错，导致环境乱七八糟 
- 不同项目需要不同版本的软件
- 重装系统后需要重新配置开发环境 
- 等等

使用 Scoop 可以解决这些问题。

Scoop 是一款开源的 Windows 命令行包管理器，简单来说，就是通过命令行来安装、管理软件，可以类比为 mac 的 `Homebrew` 以及 Linux 的 `apt`。

Scoop 适于安装轻量的、开源的、面向开发的软件，可以很大地便利开发环境的搭建，但一般不用于安装复杂大型的软件。

与传统的软件安装方式相比，使用 Scoop 有诸多好处：
- 便捷安全：省去了在浏览器里搜索软件再下载配置的繁琐过程，且能降低下载到含病毒的安装包的风险。
- 通常无需管理员权限：安装的软件默认在 `~/scoop` 目录下，不会写进系统目录。
- 减少系统环境的污染：Scoop 通过 `shim` 来管理可执行文件，避免系统 PATH 的污染。
- 会自动安装依赖、 支持多版本管理等。

Scoop 的使用十分方便，只需掌握几个常用命令，就能满足一般的需求。那么接下来我们来看看如何操作吧。

{{< spacer >}}

## 安装 Scoop
首先打开 powershell（无需管理员权限），输入以下命令，即可安装 Scoop，此时 scoop 被安装到了 `C:\Users\<用户名>\scoop`

```shell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser	#允许本地脚本的运行
irm get.scoop.sh | iex	#安装scoop
```

然而，这样的安装方式可能存在问题：如果你的用户名是中文，后续可能出现神秘错误。更好的方案是指定安装路径。
有两种方法：

- 方案一：在安装前输入以下命令

```shell 
irm get.scoop.sh -outfile 'install.ps1'	#下载安装脚本
.\install.ps1 -ScoopDir 'D:\Scoop'	#以D:\Scoop为例，可以替换为你想要的绝对路径
```

如果第一个命令出现‘’路径的访问被拒绝‘’的报错，请确保你的 shell 在一个具体的目录而不是 `C:\Windows\System32` 或 `C:\`。如果是这样，输入 `cd ~`。

- 方案二：设置环境变量

```shell 
$env:SCOOP='D:\Scoop'
[Environment]::SetEnvironmentVariable('SCOOP', $env:SCOOP, 'User')
```


完成两个方案的任意一个后，运行上面的安装命令即可。
当出现绿色的成功提示 `Scoop was installed successfully!` 说明安装成功。可使用 `scoop --version` 验证安装，若能输出版本号则安装成功。

注意在 C 盘根目录新建文件夹需要管理员权限，因此不建议安装在 C 盘根目录中。


Scoop 的所有命令满足 `scoop <command> [<args>]` 的格式（`[<args>]` 指的是可选的参数）。 接下来我们来介绍几个最常用的命令。


{{< spacer >}}

## 帮助与指南
当你成功安装 Scoop 后，会有一行 `Type ‘scoop help’ for instructions` 的提示。`scoop help` 是 Scoop 所有命令的参考指南。

输入 `scoop help`，所有的命令和对应简介就会被列出来。
使用 `scoop help <command>` 可更详细地查看某一命令的具体用法。


{{< spacer >}}

## 安装与卸载
在安装开始前，请注意：Scoop 不会自动识别你是否安装了某应用，如果你已经通过 Scoop 以外的方式安装了，请不要重复安装，以免导致奇怪的错误。

安装的命令模板是 `scoop install <app>`  例如：

 ```shell 
 scoop install 7zip
 scoop install git
 scoop install python
 scoop install aria2	#aria2是一款轻量级、跨平台的命令行下载工具，提供多线程下载加速功能
 ```
 
Scoop 会在你电脑里的 bucket （即软件源，稍后介绍）中寻找并安装该应用的最新版本，并且会自动安装相关依赖且会添加到环境变量中，比如安装 python 后，直接在终端中输入 `python` 即可进入交互环境。
 
 在 应用名之后加上 `@<version>`， 便可以下载特定版本。如：`scoop install python@3.12.0`

当然你也可以加入一些选项，如 `-g` 或 `--global` 可以全局安装应用（要管理员身份，一般不需要这个选项）。关于更多的细节感兴趣的同学可以自行使用 `scoop help install` 查看。

卸载的命令则是 `scoop uninstall <app>`，使用 `-p` 或 `--purge` 可删除持久化数据（应用运行时生成的配置文件或用户数据）。

{{< spacer >}}

## 更新
- 使用 `scoop update` 可将 Scoop 本体更新至最新版本，并更新所有已添加的 Bucket 清单。
- 使用 `scoop update <app>` 可更新特定应用。
- 使用 `scoop update -a` 或 `scoop update *` 可更新所有应用。
- 使用 `scoop status` 可以检查已安装应用的的更新状态，如果有新版本，那么就会列出。
- 如果你有不想更新的应用，可以使用 `scoop hold <app>` 来保持某一特定版本而阻止更新（若是全局安装，使用 `-g` 或 `--global`），使用 `scoop unhold <app>` 可恢复更新。
- 对于开发语言的解释器工具链如 `python`、`cmake` 等，建议 hold 以免更新破坏环境。

{{< spacer >}}

## 搜索与查找
使用 `scoop list [query]` 可以列出安装的应用。其中如果不加 `[query]` 参数，就会列出所有安装的应用；如果加了，那么就就只保留那些应用名称与该 `[query]`  匹配的应用（支持正则表达式搜索） 。
例如：
```shell
scoop list git	#列出所有名称里包含git的应用
scoop list ^python	#列出所有以python开头的应用
```

使用 `scoop search <query>` 来已添加的 bucket 中查找你可以安装的应用。如果不加入 `[query]` 参数，就会列出所有可以安装的应用（当然这么做肯定不合理）。

`scoop search` 会遍历所有添加的 bucket 导致效率低下，可以考虑使用第三方搜索增强工具，如 `scoop-search`。

{{< spacer >}}

## Bucket
Bucket 是 Scoop 里面的一个重要概念，可以理解为一个应用菜单，每次运行 `scoop install` 命令的时候，Scoop 就会读取这个菜单去安装对应的应用。

更具体地说，一个 bucket 实际上是一个 git 仓库，里面存放着许多 JSON 文件（Manifest，即软件清单）。不需要知道它们的具体内容，只要明白它告诉了 Scoop 应该去哪里，应该怎么安装一个应用。

以下是 bucket 的相关命令：

使用 `scoop bucket list` 可列出所有添加的 bucket。
使用 `scoop bucket known` 可以查询目前已知的 bucket。
以下是目前官方内置的 bucket：
- main
- extras
- versions
- nirsoft
- sysinternals
- php
- nerd-fonts
- nonportable
- java
- games

其中，main 是 Scoop 的默认核心仓库，包含常用的的工具。而 extras 包含了大量带有图形界面（GUI）的应用程序，是对 main 的重要补充。

默认情况下，只有 main 被启用。
通过 `scoop bucket add <name>`  可以添加 bucket（确保你已经安装了git）
```shell
scoop bucket add extras	#下面两个示例均来源于extras
scoop install everything	#查找文件的应用
scoop install obsidian	#笔记软件
```

你也可以添加自定义的 bucket，使用 `scoop bucket add <name> <repo>`，其中 `<repo>` 是仓库的 URL。

当然，你也可以按照 Scoop 的规范去创建一个自定义的仓库，这里不多赘述。

当多个 Bucket 里存在同名应用时，Scoop 会按照 bucket 的优先级顺序进行搜索，优先从先添加的 Bucket 中查找安装（可以通过 `scoop bucket list` 查看当前优先级顺序（自上而下））。
通过 ` scoop install <bucket>/<app>` 可指定安装来源。

使用 `scoop bucket rm <name>` 移除一个 bucket。


{{< spacer >}}
{{< spacer >}}

至此，Scoop 的基础使用部分就介绍完了。

本篇中提到的这些命令已经足够满足大部分软件管理需求。
不过，Scoop 的设计并不仅仅是一个简单的软件安装工具。它背后还有完整的软件清单（Manifest）机制、版本管理方式等等。

更多的内容在进阶篇。
如果发现了文章里的问题或错误请务必指出！