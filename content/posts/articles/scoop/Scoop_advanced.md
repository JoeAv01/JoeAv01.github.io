---
title : Advanced Scoop Guide
weight : 20
---

**——by 保登心爱**



## 工作原理
在进行进阶操作的介绍之前，我们不妨先来看看 scoop 的工作原理。如果你对这个部分不感兴趣，可以直接跳过。

首先我们来看看 scoop 的目录结构。打开 scoop 的根目录，通常能看到以下文件夹：
```
~/scoop/
├── apps/         
├── buckets/     
├── cache/        
├── persist/     
└── shims/      
```

1. `apps/`  这是 Scoop 管理的所有软件的实际安装位置。安装的每一个软件都在独立文件夹中。这个文件夹里面包含版本号子文件夹和 `current/` 文件夹。其中 Scoop 会使用目录联接将 `current/` 指向具体的版本目录。在之后的版本管理我们会利用它。
2. `buckets/` 是软件源的目录，每个子文件夹都是一个 bucket 的 git 仓库，里面存放着软件的 Manifest 文件。
3. `cache/` 是缓存目录。当你执行 `scoop install` 时，Scoop 会先从网上下载压缩包到这个目录。安装完成后这些压缩包并不会删除，以便重装时避免再次下载。
4. `persist/` 是 Scoop 用于存放应用程序用户数据（配置文件、数据库、缓存等）的永久存储仓库。对于 Manifest 中声明了 persist 的应用，Scoop 会将指定的文件或目录迁移到 `persist/`，并在安装目录创建目录联接（或符号链接），从而保证升级时数据不会丢失。
5. `shims/` 是 Scoop 用来“统一管理所有命令行命令入口”的地方。它把每个软件的可执行文件变成一个 shim（垫片），再统一放在 `~/scoop/shims` 里，把这个目录加入 PATH，就能访问所有通过 Scoop 安装的命令行工具，从而让你的 PATH 更干净。

这五个文件夹便是 scoop 的主要文件夹，那么在运行 `scoop install` 时，Scoop 做了什么呢？

- 首先 Scoop 会解析 app 的名称，并在现有 bucket 中寻找对于的 Manifest 文件。
- 接下来对 Manifest 进行解析，如果存在 `depends`，会递归地先安装依赖应用。
- 将压缩包下载到 `cache/` 目录里，并按 `hash` 校验完整性。
- 把压缩包解压到 `apps/<app>/<version>/`， 并创建 `current/` 目录联接指向该版本
- 创建 `shims/` 并处理环境变量，比如若 Manifest 声明了 `env_add_path`，Scoop 会将对应路径加入环境变量，使程序可以直接访问。
- 处理持久化数据（`persist/`）与 记录安装信息。


了解了相关机理，让我们进入下一部分。

{{< spacer >}}

## 自定义安装
使用 Scoop 安装和管理软件固然方便，可是如果 buckets 里面没有你需要的软件，还有办法吗？

当然！

接下来我们介绍前面反复提到的 Manifest 文件。
一个 App Manifest 就是一个描述如何安装软件的 JSON 文件。以下是一个简单的例子：

```json title:json
{
    "version": "1.0",
    "url": "https://github.com/lukesampson/cowsay-psh/archive/master.zip",
    "extract_dir": "cowsay-psh-master",	
    "bin": "cowsay.ps1"
}
```

一个标准的 Manifest 通常包含以下基础信息：
- `version`: 软件的版本号。
- `description`: 软件的简短描述。
- `homepage`: 软件的官方主页。
- `license`: 软件的开源协议。

当然只有这些肯定是不够的，一般还会有以下：
- 下载与校验字段（url、hash、architecture）
- 安装与配置字段（extract_dir、installer、 pre_install、post_install）
- 环境与快捷方式字段（bin、env_add_path 、shortcuts）
- 持久化与配置字段（persist）
- 自动更新字段（autoupdate、 checkver）
- ...

具体的字段含义可以去 [Scoop 的 wiki](https://github.com/ScoopInstaller/Scoop/wiki/App-Manifests) 页面查看。无需记住，只要大概了解即可。

如果 Manifest 已经放在某个可访问的 URL，那么可以直接使用 `scoop install <url>`。

注意：该 URL 必须指向 Manifest 文件本身，而非软件的安装包（如 .exe / .zip）。
这种方式安装的软件不会自动加入 bucket，`scoop update` 不会从 bucket 更新它，`scoop search` 也找不到，因此管理能力有限。

使用 `scoop create <url>`  可以自动创建 Manifest 模板。输入命令后 Scoop 会指引你输入软件名与版本号。
但是此时创建出来的模板只包含基础结构， hash、bin、installer 等字段通常需要根据软件实际情况补充。这种方法一般用于单次安装而不需要后续维护的情况。

如果你打算长期维护这个软件，或者有多款自用软件，更规范的做法是建立一个本地 Bucket。可以使用脚本或 AI 工具辅助生成你想要下载软件的 Manifest，再将它放入 Bucket 里即可。

{{< spacer >}}

## 多版本管理
使用 Scoop 可以进行方便的多版本管理。

Scoop 在安装软件时，会将不同的版本隔离开来，每个版本都位于独立的文件夹中。而 `~/scoop/apps/软件名/current` 指向当前的版本。此软件的 shim 会指向这个版本的可执行文件，添加到 PATH 中。

在基础篇中，我们已经介绍了如何下载特定的版本，现在我们介绍如何进行版本的切换。

`scoop reset <app>` 用于版本的切换，如 `scoop reset python27`。此时 `current` 目录会更新，Shim 会自动指向新的版本，因此通过 PATH 调用的软件也会切换到指定版本。

由于 Shim 只能指向一个 current 目录，因此无法同时将两个版本都作为全局命令生效。
如果确实需要同时运行两个版本，可以直接使用绝对路径。如: `~/scoop/apps/python27/2.7.18/python.exe`

接下来我们来简要介绍 versions 和 java 这两个 bucket。
- main 通常维护软件的主流稳定版本，而一些旧版本或特殊版本比如 `python2.7` 会放在 versions bucket 中。
- 由于 Java 的生态系统非常复杂，如果把这些都塞进 main 仓库，会让 main 变得非常臃肿。因此，Scoop 官方单独建立了 java Bucket 来专门管理 Java 发行版。注意：reset 命令不会切换 `JAVA_HOME`

{{< spacer >}}

## 导入与导出
`scoop export` 与 `scoop import` 主要用于备份当前安装的软件列表，以及在新环境或重装系统后快速恢复这些软件。

- `scoop export > scoopfile.json` 会在当前目录将当前通过 Scoop 安装的所有应用程序（App）列表导出为一个 JSON 格式的文件。该文件主要记录应用名称及其 bucket、版本等信息，通常不会包含应用配置数据。
- `scoop import <path/url to scoopfile.json>` 会读取导出的 JSON 文件，并批量安装文件中列出的所有应用程序。

注意：
1. 使用 export 和 import 默认不会完整恢复 bucket 配置，因此导入前需要重新添加所需 bucket。同时由于 bucket 通过 git 管理，需要先下载 git。
2. 如果你使用了 `scoop install -g <app>` 安装了全局软件，`scoop export` 会记录全局安装的软件信息，但恢复全局软件时仍需要对应的权限环境。因此在还原时，建议以管理员身份运行 PowerShell。
3. import 命令本质是 `scoop install`，只会安装软件。之前在 persist 里的配置不会保留，因此如果确实需要迁移配置，需要复制对应应用的 persist 数据。 需要注意的是，部分应用配置可能包含绝对路径、用户目录或机器相关信息，直接复制到新环境可能导致异常。因此迁移时建议：
	1. 优先使用应用自身提供的配置导出功能；
	2. 只迁移必要的 persist 数据；
	3. 检查配置文件中的路径信息，并根据新环境进行修改；
	4. 在不同用户名或安装路径的机器之间迁移时，避免直接覆盖整个 Scoop 目录。

{{< spacer >}}

## 清理与维护
1. Scoop 默认会在更新软件时保留旧版本，以便在新版本出现问题时可以快速回滚。
   使用 `scoop cleanup <app>` 清理指定软件的旧版本，`scoop cleanup *` 清理所有旧版本。
2. 每次安装或更新软件时，Scoop 都会下载安装包并存放在缓存目录中。即便安装完成，这些压缩包通常也不会自动删除。
   使用 `scoop cache show` 来查看缓存。使用 `scoop cache rm <app>` 删除指定软件的缓存，`scoop cache rm *` 清理所有缓存。
3. `scoop checkup` 会检查你的环境变量、路径设置等是否存在冲突或错误，并给出修复建议。
4. 使用 `scoop info <app>` 来查看软件的信息。当某软件的 shim、版本链接或环境状态异常时，可以使用 `scoop reset <app>` 来重置软件。
5. 关于软件更新，见基础篇内容

{{< spacer >}}

## Scoop 设置
使用 `scoop config` 相关命令可以对 scoop 进行配置。
1. `scoop config` 会列出当前的所有配置，`scoop config <name>` 列出指定项的配置。
2. `scoop config <name> <value>`  对某一项进行设置。
3. `scoop config rm <name>` 删除配置项

下面介绍几个常用的配置项：
1. aria 2 多线程下载：安装 aria 2 后 Scoop 会自动检测并使用 aria 2 进行下载。
	- 使用 `scoop config aria2-enabled: $true|$false` 可以开启/关闭；
	- 使用 `scoop config aria2-warning-enabled: $true|$false` 可以在下载时显示/不显示 Aria 2 警告；
	- 也可通过修改 `aria2-split` 、`aria2-max-connection-per-server` 的值来调整线程数。
2. 配置代理：使用 `scoop config proxy <代理地址>` 以配置代理，`scoop config rm proxy` 以删除代理。
3. 修改更新源：如果 GitHub 访问缓慢，可将 Scoop 自身的更新源切到国内镜像，如：`scoop config scoop_repo https://gitee.com/glsnames/scoop-installer`，但第三方镜像可能存在延迟同步、停止维护等问题，因此请确认镜像来源可信。

{{< spacer >}}


至此，Scoop 的进阶部分也介绍完毕。

通过本篇内容，你不仅了解了 Scoop 的基本使用方式，还进一步理解了它背后的工作机制：

- Scoop 如何通过 Bucket 和 Manifest 管理软件；
- 如何创建自定义安装方案；
- 软件安装、版本切换和环境配置的实现方式；
- 如何进行软件迁移、清理和维护。

掌握这些内容后，你已经可以较为熟练地使用 Scoop 管理自己的 Windows 开发环境，并能够针对特殊需求进行调整。

希望本教程能够帮助你建立一个更加稳定、高效、易维护的 Windows 开发环境。

与之前一样，如果发现了文章里的问题或错误请务必指出！
