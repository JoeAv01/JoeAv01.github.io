---
title : Basic Syntax
weight : 10
---
Java 的语法与 C/C++ 十分相近，学习起来速度很快。

## Hello World
```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}
```

Java 版本的 Hello World，可以看出和 C 语言版的有很多相似与不同的地方：
1. Java 里的所有代码应当被包括在类里
2. Java 也需要有 main 函数（在 Java 中函数一般被称为**方法**），注意 `args[0]` 是第一个参数而不是程序本身的名称
3. `System.out.println("Hello World!");` 相当于 `printf("Hello World!\n");`。注意这里的 `ln` 会添加一个换行符，如果不添加就相当于 `printf("Hello World!")`
4. 与 C 一样，语言结尾需要加上 分号 `;` ，使用花括号 `{}` 包含多行代码

编译与运行
```shell
javac HelloWorld.java
java HelloWorld
```

第一行命令对 .java 文件进行编译，生成 HelloWorld.class 文件。第二行命令运行程序


{{< spacer >}}

## Elementary Types and I/O
### Elementary Types
Java 的基础数据类型与 C 基本一样，主要有以下不同：
- Java 有独立的布尔值 `boolean`，不能与整数类型的 0 与 非 0 相互转换
- Java 没有无符号整数，整数类型为：`byte`、`short`、`int`、`long`
- Java 的 `float` 类型在赋值时必须带 f，如 `float f=3.14f`，否则无法通过编译
- Java 不区分声明与定义，Java 的局部变量必须赋值后使用，不会像 C 一样随机分配初始值
- C 允许复合语句的局部变量遮蔽外层的变量，Java 不允许代码块中的局部变量遮蔽局部变量，但允许局部变量遮蔽字段。例如类里有成员变量 `int x`，方法里可以写 `int x = 1;`



### Output
输入使用 `System.out`:
```java
System.out.print("hello"); // 不换行
System.out.println("world"); // 换行
System.out.printf("My name is %s and I'm %d years old%n", name, age); // 格式化输出
```

占位符完整的格式为：`%[index$][标识]*[最小宽度][.精度]转换符`，这里不详细介绍

### Input
`java.util.Scanner` 是最简单、最常用的控制台/文件输入工具

```java
import java.util.Scanner;

public class InputTest {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.print("Your name：");
        String name = scanner.nextLine();   // 读取一行
        
        System.out.print("Your age：");
        int age = scanner.nextInt();        // 读取整数
        
        System.out.print("Your height(m)：");
        double height = scanner.nextDouble();
        
        scanner.close();
    }
}
```

常用方法：
```
nextLine()	    读取一行（含空格）
next()	        读取下一个单词（以空白分隔）
nextInt()	    读取 int，此时缓冲区剩余换行符，使用nextLine()只会读取换行符
nextDouble()	读取 double，注意同上
hasNext()   	检查是否还有输入
```

{{< spacer >}}

## Control Flows
### Selection
与 C 基本一致，有以下区别：
- if-else 条件只能是 `boolean` 类型，不可为其他类型
- switch 语句支持字符串(Java 7+)。
- 在 Java 14 起正式支持 switch 表达式和 `yield`，可以使用 ` yield ` 返回值
```java
String type = switch (day) {
    case MONDAY, TUESDAY -> "weekdays"; //使用箭头无需break
    case FRIDAY -> {
        System.out.println("close to weekend");
        yield "weekdays";
    }
    default -> "others";
};
```


### Loops
与 C 基本一致，有以下区别：
- 判断是否退出循环的条件只能是 `boolean` 类型，不可为其他类型
- 支持 for-each，当然 C++ 也支持
```java
for (String s : list)
	System.out.println(s);
```

{{< spacer >}}
## Arrays
- 一个数组是一个对象
- 数组的定义：使用 `new` 定义， `dataType [] a = new dataType[size];`，定义后每个元素会被初始化为 0 值（0，null，false）
- 与 C 类似，可以在定义时对数组进行初始化，如 `int [] a = {1, 2, 3};` 或 `int[] a = new int[]{1,2,3};`
- 数组大小不可变，使用 `.length` 属性获取数组现有长度
- 多维数组允许每行长度不同，如： `int [][] a = { {1,2,3,4,5}, {1,2,3,4}, {1,2,3}, {1,2}, {1}};`
- Java 没有指针，因此不能对数组名进行类似指针加减的操作 
- `System.arraycopy` 是一个原生的数组方法，具体格式如下：`System.arraycopy(初始数组, 初始数组起始位置, 目标数组, 目标数组起始位置， 复制元素个数);`	
当然也可以利用它来继续移动、删除操作等，如：` System.arraycopy(arr, 2, arr, 1, 3); `

{{< spacer >}}
## String
建议看完 Class 后再来看这部分。
Java 的字符串 `String` 类，位于 `java.lang` 包中 。`String` 是 `fina` l 类，不能被继承；字符串内容一旦创建就不能修改。所有“修改”字符串的方法，都会返回一个新的 `String` 对象。

字符串字面量会进入字符串常量池，相同字面量复用同一对象。
```java
String a = "hello";
String b = "hello";
System.out.println(a == b); // true
```

`new String("hello")` 会在堆中创建一个新对象，即使常量池已有 `"hello"`。
```java
String c = new String("hello");
System.out.println(a == c);      // false
System.out.println(a.equals(c)); // true
```
### Constructing
```java
String s1 = "Java";                         // 字面量，进入常量池
String s2 = new String("Java");             // 堆中新对象
char[] chars = {'J', 'a', 'v', 'a'};
String s3 = new String(chars);              // 从字符数组创建
byte[] bytes = {74, 97, 118, 97};
String s4 = new String(bytes, StandardCharsets.UTF_8); // 从字节数组创建
```

### Methods
以下是一些常用方法
```java
String s = "Hello, Java";
s.length();                 // 长度
s.charAt(0);                // 'H'
s.isEmpty();                // 是否为空
s.isBlank();                // 是否只含空白，Java 11+
s.substring(7);             // "Java"
s.indexOf("Java");          // 7
s.contains("Java");         // true
s.startsWith("Hello");      // true
s.endsWith("Java");         // true
s.equals("Hello, Java");    // true,字符串比较不应使用==
s.equalsIgnoreCase("hello, java"); // true
s.compareTo("Hello, World");// 字典序比较
s.replace("Java", "World"); // "Hello, World"
s.split(", ");              // ["Hello", "Java"]
s.trim();                   // 去首尾空白，Java 11 推荐 strip()
s.strip();                  // 去首尾 Unicode 空白，Java 11+
s.toLowerCase();
s.toUpperCase();
s.toCharArray();
s.getBytes(StandardCharsets.UTF_8);
String.join("-", "A", "B", "C"); // "A-B-C"
String.format("%s=%d", "age", 18); // "age=18"
"ab".repeat(3);             // "ababab"，Java 11+
```

### Concatenation
少量拼接可以直接用 `+`：
```java
String name = "Java";
String msg = "Hello, " + name;
```

但使用 `+` 的同时会生成临时对象，因此大量循环拼接不应该使用 `+`，而应该使用 `StringBuilder`：
```java
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i).append(",");
}
String result = sb.toString();
```

{{< spacer >}}
## File I/O
我一直不擅长文件读写，这里把零碎的知识点丢给 ai 整理了一下。下面的看看就好（）。

### File
`File` 是文件和目录路径名的抽象表示。也就是说，`File` 对象表示一个路径，但不代表该路径一定真实存在。如：

```java
File file = new File("data.txt");
System.out.println(file.exists());
```

常用方法有：

```java
exists()
createNewFile()
delete()
getName()
getAbsolutePath()
length()
isFile()
isDirectory()
listFiles()
```

`File` 属于较早期的 I/O API，现代 Java 更推荐配合 `Path` 和 `Files` 使用。

### Path

`Path` 是 NIO.2 中更现代的路径表示，通常配合 `Files` 工具类使用。如：

```java
Path path1 = Path.of("data.txt");
Path path2 = Paths.get("dir", "data.txt");
```

`Path` 只表示路径，真正读写文件通常使用 `Files`：

```java
Files.exists(path1);
Files.createFile(path1);
Files.delete(path1);
Files.copy(path1, path2);
Files.move(path1, path2);
```


Java 文件 I/O 大体可以分为两类：
- **Text I/O**：面向**字符**，处理文本内容，涉及字符编码。
- **Binary I/O**：面向**字节**，处理原始二进制数据，不关心字符编码。


### Text I/O

Text I/O 主要使用 `Reader` 和 `Writer` 体系。

常见实现类：

```java
FileReader
FileWriter
BufferedReader
BufferedWriter
InputStreamReader
OutputStreamWriter
PrintWriter
```

#### Writing Text

`PrintWriter` 适合写文本，提供 `print()`、`println()`、`printf()` 等方法。

```java
import java.io.PrintWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

try (PrintWriter out = new PrintWriter("output.txt", StandardCharsets.UTF_8)) {
    out.println("Hello");
    out.printf("%d%n", 123);
} catch (IOException e) {
    e.printStackTrace();
}
```

如果需要追加内容，可以使用 `FileWriter`：

```java
try (PrintWriter out = new PrintWriter(
        new FileWriter("output.txt", StandardCharsets.UTF_8, true))) {
    out.println("追加一行");
} catch (IOException e) {
    e.printStackTrace();
}
```

#### Reading Text

`BufferedReader` 适合按行高效读取文本：

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.charset.StandardCharsets;

try (BufferedReader br = Files.newBufferedReader(
        Path.of("input.txt"), StandardCharsets.UTF_8)) {
    String line;
    while ((line = br.readLine()) != null) {
        System.out.println(line);
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

`Scanner` 也可以读取文本，适合解析输入，但性能通常不如 `BufferedReader`：

```java
try (Scanner scanner = new Scanner(Path.of("input.txt"), StandardCharsets.UTF_8)) {
    while (scanner.hasNextLine()) {
        System.out.println(scanner.nextLine());
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

#### Files Shortcut for Text

Java 11+ 提供了一些非常方便的快捷方法：

```java
String content = Files.readString(Path.of("input.txt"), StandardCharsets.UTF_8);

List<String> lines = Files.readAllLines(Path.of("input.txt"), StandardCharsets.UTF_8);

Files.writeString(Path.of("output.txt"), "Hello", StandardCharsets.UTF_8);
```

#### Conversion Streams

`InputStreamReader` 可以把字节流转换为字符流：

```java
try (BufferedReader br = new BufferedReader(
        new InputStreamReader(
                new FileInputStream("input.txt"),
                StandardCharsets.UTF_8))) {
    String line;
    while ((line = br.readLine()) != null) {
        System.out.println(line);
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

`OutputStreamWriter` 可以把字符流转换为字节流：

```java
try (Writer writer = new OutputStreamWriter(
        new FileOutputStream("output.txt"),
        StandardCharsets.UTF_8)) {
    writer.write("你好");
} catch (IOException e) {
    e.printStackTrace();
}
```


### Binary I/O

Binary I/O 主要使用 `InputStream` 和 `OutputStream` 体系。

常见实现类：

```java
FileInputStream
FileOutputStream
BufferedInputStream
BufferedOutputStream
DataInputStream
DataOutputStream
ObjectInputStream
ObjectOutputStream
```

#### Byte Stream Basics

`InputStream.read()` 返回一个字节值 `0~255`，如果到达文件末尾则返回 `-1`。

`OutputStream.write(int)` 写入一个字节，只使用低 8 位。

复制文件示例：

```java
try (InputStream in = new FileInputStream("a.png");
     OutputStream out = new FileOutputStream("copy.png")) {

    byte[] buffer = new byte[8192];
    int len;

    while ((len = in.read(buffer)) != -1) {
        out.write(buffer, 0, len);
    }

} catch (IOException e) {
    e.printStackTrace();
}
```

#### Buffered Byte Streams

`BufferedInputStream` 和 `BufferedOutputStream` 可以减少系统调用，提高读写效率。

```java
try (InputStream in = new BufferedInputStream(
        new FileInputStream("a.png"));
     OutputStream out = new BufferedOutputStream(
        new FileOutputStream("copy.png"))) {

    byte[] buffer = new byte[8192];
    int len;

    while ((len = in.read(buffer)) != -1) {
        out.write(buffer, 0, len);
    }

} catch (IOException e) {
    e.printStackTrace();
}
```

#### Primitive Binary Read/Write

`DataInputStream` 和 `DataOutputStream` 可以读写 Java 基本类型。

写入：

```java
try (DataOutputStream out = new DataOutputStream(
        new BufferedOutputStream(
                new FileOutputStream("data.bin")))) {

    out.writeInt(42);
    out.writeDouble(3.14);
    out.writeBoolean(true);
    out.writeUTF("你好");

} catch (IOException e) {
    e.printStackTrace();
}
```

读取时必须按写入顺序和类型读取：

```java
try (DataInputStream in = new DataInputStream(
        new BufferedInputStream(
                new FileInputStream("data.bin")))) {

    int i = in.readInt();
    double d = in.readDouble();
    boolean b = in.readBoolean();
    String s = in.readUTF();

    System.out.println(i);
    System.out.println(d);
    System.out.println(b);
    System.out.println(s);

} catch (IOException e) {
    e.printStackTrace();
}
```

#### Serializable

`ObjectOutputStream` 和 `ObjectInputStream` 可以读写 Java 对象。

被序列化的类必须实现 `Serializable` 接口：

```java
import java.io.Serializable;

class User implements Serializable {
    private static final long serialVersionUID = 1L;

    String name;
    transient String password; // transient 字段不会被序列化
}
```

写入对象：

```java
try (ObjectOutputStream out = new ObjectOutputStream(
        new FileOutputStream("user.bin"))) {

    out.writeObject(new User());

} catch (IOException e) {
    e.printStackTrace();
}
```

读取对象：

```java
try (ObjectInputStream in = new ObjectInputStream(
        new FileInputStream("user.bin"))) {

    User user = (User) in.readObject();
    System.out.println(user.name);

} catch (IOException | ClassNotFoundException e) {
    e.printStackTrace();
}
```

注意：

- `serialVersionUID` 建议显式声明。
- `transient` 字段不会被序列化。
- 不要反序列化不可信数据，存在安全风险。


#### Files Shortcut for Binary

```java
byte[] bytes = Files.readAllBytes(Path.of("a.bin"));
Files.write(Path.of("b.bin"), bytes);
```
