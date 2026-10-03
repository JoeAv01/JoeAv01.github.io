--- 
title : Exception, Assertion and Tests
weight : 40
---
这一节是关于 Java 的错误处理。

## Dealing with Errors
程序运行过程中，出现错误也是难免，关键是怎么处理，以下是常见的处理方式：
- 返回到一个安全的状态并使用户可以运行其他命令；
- 使用户优雅地保存并结束程序。

这不是一件容易的事，你可能会遇到以下几种常见的错误：
- 用户输入错误：可能会遇到不走寻常路的用户；
- 仪器错误：比如没纸的打印机；
- 物理极限：比如硬盘被写满或内存耗尽；
- 代码错误：最常见的错误。

传统的处理方法是返回一个错误码（如 -1），使得调用的方法分析错误。但这不是总可以这么做，比如 -1 也可能是一个有效值。

因此我们采用*throw exception* 的方法。

{{< spacer >}}
## Exceptions
### The Classification of Exceptions
Java 中所有异常继承自 `Throwable` 类，又下分为 `Error` 和  `Exception`。
{{< center-image 
    src="images/java/exception.png" 
    alt="exception" 
    width="60%"
>}}
其中 `Error` 通常表示应用程序一般不应该尝试恢复的严重问题，通常不应捕获和处理，若发生，则通知用户，并尝试终止程序。
而 `Exception` 为程序可以处理的异常。又分为 `Runtime Exception`、`IOException` 等等类。其中 `RuntimeException` 类表示运行时异常，由程序错误导致，比如错误的转型、数组越界以及空指针等等。

异常还可分为**受检异常（checked exception）** 与**非受检异常（unchecked except）**
- 受检异常继承自 `Exception`，但不继承 `RuntimeException`。编译器强制要求处理。要么被捕获，要么被声明。比如 `IOException`、`SQLException`、`ClassNotFoundException`、` InterruptedException` 等。
- 非受检异常继承自 `RuntimeException`，以及 `Error`。通常表示编程错误、逻辑错误或不可恢复问题。编译器不强制处理。比如 `NullPointerException`、`ArrayIndexOutOfBoundsException`、`ClassCastException`、`IllegalArgumentException`。

### Declare Checked Exceptions
如果一个 checked exception 可能从方法中传播出去，而没有在方法内部被捕获，那么该方法必须通过 `throws` 声明该异常或其父类型。
```java
public Image loadImage(String s) throws
FileNotFoundException, EOFException
{
	...
}
```
子类重写方法时，不能抛出比父类方法更宽泛的受检异常。`RuntimeException` 和 `Error` 不受此限制。

### Throw an Exception
有时我们需要手动抛出异常：
```java
throw new EOFException();
//或
var e = new EOFException();
throw e;
```

### Create Exception Classes
有时可能遇到无法用标准异常类表示的异常，此时我们可以自定义异常类：
```java
class FileFormatException extends IOException
{
	public FileFormatException() {}
	public FileFormatException(String gripe)
	{
		super(gripe);
	}
}
```

### Catch Exceptions
使用 `try-catch` 块来捕获异常；
```java
try {
    // Statements that may throw exceptions
} catch (Exception1 exVar1) {
    // handler for exception1;
} catch (Exception2 exVar2) {
    // handler for exception2;
}
...
catch (ExceptionN exVar3) {
    // handler for exceptionN;
}
```
可以使用多个 `catch` 语句来捕获 `try` 语句块中可能发生的多种异常，检测顺序是自上而下。
如果多个 `catch` 捕获的异常类型之间存在继承关系，则子类异常必须写在父类异常之前。

### Rethrow an Exception
有时，在捕获异常后，我们不能完全处理异常，而是再次抛出，让上层调用者继续处理：
```java
try {
    code
} catch (IOException e) {
    System.err.println("Fail: " + e.getMessage());
    throw e; // rethrow
}
```

### The finally Clause
当控制流正常或异常地离开相应的 `try` / `catch` 时，`finally` 子句内的代码都会被执行：
```java
try {
    // statements;
} catch (TheException ex) {
    // handling ex;
} finally {
    // finalStatements;
}
//或
try {
    // 可能出错的代码
} finally {
    // 清理代码
}
```


`finally` 的基本规则是：只要程序控制流进入过对应的 `try` 块，并且 `JVM` 没有直接退出，`finally` 通常都会执行。
执行顺序大致如下：
1. `try` 正常执行完 → 执行  `finally` → 继续往后执行。
2. `try` 抛出异常，有匹配的 `catch` → 执行 `catch` → 执行 `finally`。
3. `try` 抛出异常，没有匹配的 `catch` → 执行 `finally` → 异常继续向上抛。
4. `try` 或 `catch` 中有 `return`、`throw`、`break`、`continue` → 先执行 `finally`，再执行这些跳转。

`finally` 子句是为了清理资源，不应该在里面添加控制流或继续抛出异常。`finally` 与 `return` 的关系非常复杂，这里不列出。

### The try-with-Resources Statement
`try-with-resources`  是 Java 7 引入的一种异常处理语法，用于自动关闭资源。资源是指程序使用完毕后必须关闭的对象，比如文件流、网络连接、数据库连接等。只要资源实现了 `java.lang.AutoCloseable` 接口，就可以用 `try-with-resources` 管理。

它的核心目标是：无论 `try` 块是否发生异常，资源都会在语句结束时自动关闭，避免资源泄漏。

这里就不再详细介绍了。

### Tips for Exceptions
这部分直接抄的书
1. 异常处理不能替代简单检查
能用普通条件判断时就用判断，异常只用于真正异常的情况。

2. 不要微观管理异常
不要给每条语句都包一个 `try/catch`。应按任务边界包裹，这样代码更干净，也实现“正常处理与错误处理分离”。

3. 善用异常层次结构
不要直接抛 `RuntimeException`，应找合适子类或自定义异常。
不要直接 `catch Throwable`，会降低可读性和可维护性。
尊重 `checked / unchecked` 异常区别；逻辑错误不要抛 `checked` 异常。
必要时把一种异常转换成更合适的异常，如把 `NumberFormatException` 转为 `IOException` 或自定义子系统异常。

4. 不要压制/吞掉异常
空 `catch (Exception e) {}` 会让异常被静默忽略。若认为异常重要，就应正确处理：处理、记录或传播。

5. 发现错误时要“果断抛异常”，不要纵容
方法遇到无效参数或失败状态时，抛异常通常比返回 null 或假值更好。否则错误会延迟到后面，变成更难排查的 `NullPointerException` 等问题。

6. 传播异常并不可耻
不必捕获所有异常。高层方法通常更适合通知用户或放弃命令。方法可以声明 `throws IOException`，把异常交给调用者处理。

7. 用标准方法报告空指针和越界异常
使用 `Objects.requireNonNull`、`Objects.checkIndex`、`checkFromToIndex`、`checkFromIndexSize` 等做参数校验，异常信息和 Java 标准库保持一致。

8. 不要向最终用户显示堆栈跟踪
堆栈跟踪可能泄露实现细节和库版本。应记录到日志中供排查，只向用户显示简要错误信息。


{{< spacer >}}
## Assertions
断言语句用于在开发和测试阶段检查程序内部的假设是否成立。如果条件不成立，就抛出 `AssertionError`。

基本语法为：
```java
assert condition;
assert condition : detailMessage;
```
- `condition` 必须是 `boolean` 表达式，如果为 `false`，抛出 `AssertionError`。
- `detailMessage` 可选，用于提供失败信息，可以是任意表达式，如 `assert x > 0 : "x is " + x;`

Java 断言默认是关闭的。如果要开启：
```java
java -ea Main
java -enableassertions Main
```
关闭则是：
```java
java -da Main
java -disableassertions Main
```

 Assertion 的最大原则：千万不要产生必要副作用
使用 Assertions 的情况：
- 错误是致命不可恢复的；
- 不要把它当作普通异常来处理；
- 不要在 `public` 方法中使用断言进行参数检查。

{{< spacer >}}

## JUnit Test
- JUnit 是 Java 生态中最主流的单元测试框架，能帮助开发者编写和运行可重复的自动化测试。JUnit 5 中通常使用 **JUnit Jupiter** 编写测试。
- 通过打注解的方式对代码片段进行测试，其中最常用的注解是 `@Test`
- 断言（Assertions）：
	- `assertEquals(expected, actual)` – 判断值相等
	- `assertTrue(condition) / assertFalse(condition)`
	- `assertNull / assertNotNull`
	- `assertThrows(异常类, 可执行代码)` – 验证是否抛出期望异常
	- `assertAll` – 分组断言，所有断言都会执行，不会因一个失败而中止
	- `assertTimeout` – 验证操作在指定时间内完成
- 假设（Assumptions）： 位于 Assumptions 类，用于条件执行：当假设不满足时，测试会被忽略而不是失败。 
	- `assumeTrue(condition)` – 条件为 false 则跳过测试 
	- `assumingThat(condition, executable)` – 条件为 true 时才执行部分断言

例子（被验证代码省略）：
```java

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class TestSort {

    @Test
    void testSort() {
        String[] input = {"i", "have", "an", "egg"};
        String[] expected = {"an", "egg", "have", "i"};

        Sort.sort(input);

        assertArrayEquals(expected, input);
    }
}
```
