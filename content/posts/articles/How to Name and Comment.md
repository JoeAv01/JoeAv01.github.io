---
title : How to Name and Comment
weight : 20
---

对于刚刚入门编程的小白来说，命名变量不是一件容易的事情。

初学者的代码中往往容易出现 `data`、`sum` 甚至是 `a, b ,c`  这样的变量。

此外，为了图方便，代码中也是毫无注释，或是充满无意义的废话。

这显然毫无可读性，如果代码中充斥大量这样的命名又没有正确的注释，那么恐怕只有上帝和你自己能看懂你的代码（你自己也不一定能看懂）。

因此研究如何命名与注释十分有必要。
## How to Name
从风格和内容的角度，可以极大优化命名方式，提升代码的可读性。

### 风格 
每种语言都有对应的代码风格，例如在 python 中，类用 `CapWords` / `PascalCase`，函数、方法和变量使用 `snake_case`，常量用 `UPPER_SNAKE_CASE`。可以去查看对应的官方 style guide，或者看这份[谷歌的 guide](https://google.github.io/styleguide)。

同时需要注意，团队规范优先于个人偏好。

### 内容
在继续之前，必须指出命名困难往往意味着设计还不够清晰。如果你发现你很难命名一个变量或函数，说明你的代码设计可能不够好。

好的命名应该做到让读代码的人尽量不用猜。

这意味着名字要尽可能完全、准确地描述出该变量所代表的事物。例如：`currentDate` 往往优于 `cd` 和 `date`。

命名应该尽量具体，能做出有意义的区分。比如 `data` 没有提供额外的信息，`user_data` 好了一点，但是还是不够。根据实际情况应该改成如下 ：
```
user_profile
user_credentials
user_preferences
user_activity_history
```

命名应该避免制造误导。要使用可以读出来、说出来的名字，这会方便代码交流，同时使用容易搜索的名字。


一个好名字应该表达 “what”，名字应该来自问题领域。比如说，如果是一个电商系统，应该使用：
```
Order
Cart
Invoice
Refund
Shipment
Customer
```
技术领域也应该使用专业术语。不是什么地方都要抽象成：
```
Data
Item
Object
Handler
```

一个概念应该对应一个词，如：
```
fetchUser()
getAccount()
retrieveOrder()
```
如果它们表达是一个意思，应该统一：
```txt
getUser()
getAccount()
getOrder()
```
同一个概念尽量保持同一个词，不同概念也不应该使用一个词。如 `add()` 适用与很多地方，但是根据更具体的用处可以分为 `append()` 、`insert()`。

对于特定的数据类型，这里也有一些特定的规则：
1. 类名通常应该是名词
2. 方法名通常应该是动词
3. 布尔值尽量读起来像判断句如：`isValid` 、`hasPermission`。同时不要使用否定，否则使用起来很容易混乱
4. 重要常量起名字，不要留下魔法数字
5. 对于循环下标，如果循环很短，通常使用约定俗成的 `i` 、`j`、`k`，如果循环体较长，或者变量在循环体外要使用，就应该使用更清晰的命名
6. 对于状态变量，不要使用 `flag`，起一个更好的名字。
7. 对于临时变量，如果它实际上是有作用的，就不应该取名为 `tmp`


关于名字的长度，通常是在能传递信息的前提下而短小。
缩写是一个常见的选择，但确保缩写是标准的，至少让人能看懂。

[Go 语言官方的 What's in a name](https://go.dev/talks/2014/names.slide), 指出，命名的一个基本原则是；一个变量的声明与它使用的距离越远，那么它的名称应当越长。

- 对于局部变量，应当使其名字更短；长的名字会模糊代码做了什么。
- 在有明确上下文的背景下，避免冗长的名字， 例如 `count` 优于 `runeCount` 在一个名字为 `RuneCount` 的函数中。
- 参数名与局部变量类似，不同的是，它们会出现在 docs 中。
	- 如果它们的类型名很明确，比如是 `Duration` ，此时命名应该短，如 `d`。
	- 如果类型名不明确，此时应该详细一些以在 docs 中提供信息。
- 对于函数返回的值，它们的名字应当反映 docs 的目的。


## How to Comment
与命名一样，不同的语言也有不同的注释要求，比如 Java 的公开 API 通常使用 Javadoc，Python 则推荐使用 docstring。

当然各个语言之间也有共性的原则。

注释的基本原则是：**注释不是为了翻译代码，而是为了补充代码无法清楚表达的信息。**
如果代码本身能通过命名和结构表达清楚，就优先改代码，不要加注释。

注释大致分为两种：API/文档的说明性注释与模块内部的行间注释。

### API/文档注释
API/文档注释注释的判断标准是：如果我是这个函数的调用者，而不是实现者，我需要知道什么？

因此它们适合说明：
- 方法的目的
- 参数的特殊含义
- 返回值语义
- 异常 / 错误条件
- 前置条件
- 副作用
- 非显而易见的业务规则
- 调用方必须知道的限制

如：
```java
/**
 * Calculates the final price after applying the user's active discount.
 *
 * @param userId id of the user whose discount should be applied
 * @param basePrice original price before discounts
 * @return final price after discount
 * @throws UserNotFoundException if the user does not exist
 */
public BigDecimal calculateFinalPrice(
	long userId,
    BigDecimal basePrice) {
...
}
```

不要在方法前重复函数名，如果函数很简单，不写注释往往比写废话更好。
### 行间注释
行间注释在于重点解释“为什么”。

不应该解释“代码正在做什么”。代码自己就应该说明白自己在做什么，这样只是废话，甚至可能出现以后代码修改了，注释可能没修改，导致错误。

行间注释应该包括以下内容：
1. 解释业务原因
2. 解释奇怪的技术限制
3. 解释算法中不明显的步骤
4. 说明违反直觉的代码
5. 解释 workaround

注释不应该补偿烂代码，发现自己需要大量注释时，先检查代码设计是否过于复杂。



当然了，这篇文章讲的十分基础，只能到达入门的水平。许多内容也有很多局限性，需具体情况具体分析。想要真正掌握命名与注释，必须在大量的代码的实战中学习总结。
但是在如今的 ai 时代像这样的文章恐怕已经没有意义了吧。