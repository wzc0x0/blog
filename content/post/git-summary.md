---
date: 2019-08-07
lastmod: 2019-08-07
title: "git 常用命令行操作总结"
tags: ["git"]
categories: ["git"]
---

# 安装 git

[windows 客户端](https://git-scm.com/downloads)  
好用的[vscode](https://code.visualstudio.com/)代码编辑器内置 git 管理。

# Cli

```bash
# 创建版本库
git init
# 当前目录所有文件添加到仓库
git add .
# 提交
git commit -m "xxxx"

# 版本回退
git log # 查看版本hash
git reset --hard {loghash}
git push -f # 远程仓库回退

# 同步远端仓库
git fetch
# 同步并合并本地仓库
git pull
# 同步本地关联的主分支
git pull origin master

# 拉取远程分支文件或者整个文件夹，替换本地文件
git checkout origin/master {filePath}

# 未add的文件修改还原
git checkout -- {fielPath}
# 已经add文件还原 然后接着上面操作
git reset HEAD {filePath}

# 添加远程仓库
git remote add origin http://xxx.git
# 推送本地仓库 （远程和本地master关联起来）
git push -u origin master

# 当前HEAD下新建分支
git checkout -b {name}
# 合并name分支到当前分支，当前分支HEAD指向name，更新当前分支。
git merge {name}

# 查看分支关联
git branch -vv
# 删除远程分支
git branch -ｒ # 查看远程分支
git branch -r -d origin/branch-name
git push origin :branch-name

# 打当前提交标签 or 某次提交的标签
git tag v1.0 {commit-hash}
# 查看标签
git tag
# 删除标签
git tag -d {tag-name}
# 标签推送远端
git push --tag

# 暂存便于切换分支
git stash
# 暂存释放
git stash pop

# 干净整洁提交记录
git rebase # 整理本地太多合并记录
# 最近的 4 次提交纪录 打开vi界面 按下i键修改
# p(pick)使用这次提交，s(squash)这些提交合并在一起
# 按下esc :wq 保存更改
git rebase -i HEAD~4
# 到commit-hash 这次的提交合并
git rebase -i {commit-hash}
# rebase完成
git rebase --continue
```

# 优化提交格式

推荐使用[gitmoji](https://gitmoji.carloscuesta.me/)优化提交信息格式。cli 工具使用（需要 nodejs 环境）：

```bash
# 安装gitmoji-cli
npm i -g gitmoji-cli
# 当前目录加入commit钩子
# git commit 时候选择提交内容
gitmoji -i
```

# 多人协作工作模式

{{< blockquote author="廖雪峰" link="https://www.liaoxuefeng.com/wiki/896043488029600/900375748016320" >}}

- 首先，可以试图用 `git push origin <branch-name>`推送自己的修改；
- 如果推送失败，则因为远程分支比你的本地更新，需要先用 `git pull` 试图合并；
- 如果合并有冲突，则解决冲突，并在本地提交；
- 没有冲突或者解决掉冲突后，再用 `git push origin <branch-name>`推送就能成功！

如果 `git pull` 提示 `no tracking information`，则说明本地分支和远程分支的链接关系没有创建，用命令 `git branch --set-upstream-to <branch-name> origin/<branch-name>`。

{{< /blockquote >}}

# GitHub 参与开源项目流程

fork 远程仓库

```bash
# 克隆到本地自己的fork的仓库
git clone http://yourself.git
# 建立远程开源项目链接
git remote add upstream http://opensource.git
# 从远程开源项目更新
git fecth upstream
# 合并远程主分支更新本地仓库代码
git merge upstream/master
```
