---
title : Classes & Objects
weight : 20
---
这一节我们介绍 Java 中的类与对象。


## Basic Introduction
```java
public class Dog {
	int size;
	String name;
	
	public void bark() {
		System.out.print("woof!");
	}
}
```
这里给出了一个类，包含两部分：类的成员变量，即**字段（Field）**，以及**方法(Methods)**，如 `bark()`。
字段分为**实例变量(Instance Variables)**，如 `size`、`name`；和后面介绍的静态变量。

方法中定义的变量称为局部变量。

{{< spacer >}}

## Definition
`Dog myDog = new Dog();`, 这样就创建了一个对象，使用 `.` 运算符调用实例变量与方法，如 `myDog.size = 10;`  `myDog.bark();`。

实例字段在定义后会被初始化为 0 值（null、false），局部变量不会自动初始化，使用前必须显式赋值。

Java 方法采用值传递：基本类型传值副本，引用类型传引用的副本（类似传指针）。


{{< spacer >}}
## Reference
实际上，没有‘’对象变量‘’而只有‘’引用到对象的变量‘’。当一个对象被创建，系统会为其分配内存，而对象名实际上是指向这块空间的**引用 （Reference）**，类似 C 的指针。

因此 `Dog yourDog = myDog;` 中，`yourDog` 和 `myDog` 实际上是同一对象。即 `yourDog==myDog` 的值是 true。
因此比较对象的内容应该使用 `equals()` 方法而不是 `==`

需要注意 Java 实际上没有指针，不能对对象名使用 C 中指针的操作，如指针自增。

{{< spacer >}}

## Constructors
严格来说 constructor 应该被称为**构造器**，它不是方法。只是我习惯把它叫做构造函数。

Java 中的构造函数的方法名必须与类名完全相同，且不可有返回类型：
```java
public Dog(int s, String str) {
	this.size = s;	// 这里的this也可省略
	this.name = str;
}
```

如果一个类中没有定义任何构造函数，编译器会自动提供一个无参默认构造函数，对实例变量进行零初始化。默认的构造函数方法体为空，且访问权限与类一致。

如果在对实例变量声明时直接赋值，即显式初始化，这会在 `super()` 调用之后、构造函数体代码之前执行

`this()` 用于在构造函数内部调用本类其他重载构造函数
如
```java
public Student(String name, int score) {
        this.name = name;
        this.score = score;
    }

    public Student() {
        this("Unknown", 60);
    }

```
`this()` 必须是构造函数体内的第一条语句，只能出现一次，且不可与 `super()` 同时使用，也不允许递归调用。

关于子类调用父类构造函数的问题，在继承一节。

{{< spacer >}}
## Key words

### this
`this` 关键字表示对当前对象的引用，指向调用方法或构造器的那个实例。

如果方法或构造函数的参数名与实例变量不同名，可以省略；否则必须使用。

在构造函数中，可以使用 `this(参数列表)` 来调用本类的另一个构造函数，且必须位于构造函数的第一行。
```java
public class Person {
    private String name;
    private int age;

    public Person() {
        this("Unknown", 0); 
    }

    public Person(String name, int age) {
        this.name = name;	//这里的this不可省略
        this.age = age;
    }
}
```
关于 `super` 关键字的介绍在继承一节。


### var
`var` 关键字在 Java 中用于局部变量类型推断，它允许你在声明局部变量时省略显式的类型，编译器会根据右侧的初始化表达式自动推断出变量的类型。这能够减少冗余代码，但过度使用 `var` 可能会降低代码的可读性。
```java
var list = new ArrayList<String>();  // 推断为 ArrayList<String>
var stream = list.stream();          // 推断为 Stream<String>
for (var counter = 0; counter < 10; counter++)  {...}                     // 推断为 int
```

`var` 可用于局部变量、带有初始化器的变量以及 `for` 循环中的索引变量。

`var` 是一个保留类型名称而非关键字，这意味着可以给变量命名为 `var`。


### static
在 Java，`static` 关键字表示静态。被 `static` 修饰的成员属于类本身，而不属于某个具体的对象。它随着类的初始化而初始化，并且被该类的所有实例共享。

#### Static Variables
**静态变量（Static Variable）** 也叫类变量，属于类，所有对象共享同一份数据。有如下特点：
- 在类加载时分配内存，只初始化一次；
- 所有实例共享同一个静态变量；
- 可以通过 `类名.静态变量名` 访问，也可以通过对象访问。

#### Static Methods
- **静态方法（Static Method）** 属于类，可以不创建对象直接调用。有如下特点：
- 只能直接访问静态成员（静态变量、静态方法），不能直接访问实例变量、实例方法；
- 不能使用 `this` 和 `super` 关键字；
- 可以被继承，但不能被重写，子类可以定义同签名静态方法，这称为“隐藏”；
- `main` 方法必须是静态的。


### final
`final` 关键字可以与 C/C++中的 `const` 类比（Java 有保留字 `const`，但是没有任何实际功能）。它可以修饰变量、方法、类，分别表示变量不可修改、方法不可重写、类不可继承。

- 修饰变量：
	- 被 `final` 修饰的变量一旦初始化后就不能再改变；
	- 如果修饰的是引用变量，那么可以修改对象的内容；
	- 如果声明时不赋值，称为空 `final` 变量。空 `final` 变量必须在每个构造函数中都赋值，且只能赋值一次；
	- 静态 `final` 变量必须在声明时或静态初始化块中赋值，不能在构造函数中赋值；
	- 方法参数可以用 `final` 修饰，表示在方法体内不能重新赋值。
- 修饰方法：`final` 方法可以被继承，但是不能被子类重写。
- 修饰类：被 `final` 修饰的类不能被继承。

{{< spacer >}}

## Encapsulation
Java 中控制访问的修饰符一共有四种，它们的权限控制如下：

| 修饰符<br>   | 本类  | 同包  | 子类  | 其他包 |
| --------- | --- | --- | --- | --- |
| private   | 是   | 否   | 否   | 否   |
| 无修饰符      | 是   | 是   | 否   | 否   |
| protected | 是   | 是   | 是   | 否   |
| public    | 是   | 是   | 是   | 是   |

关于 `protected`，`protected` 对跨包子类开放，但跨包子类访问实例成员时存在额外限制：不能通过任意父类对象引用访问。

{{< spacer >}}
## Method Overloading
与 C++类似，Java 中存在**方法重载（Method Overloading）** ，允许一个类中存在多个同名方法，但具有不同的签名（方法名 + 参数列表）。编译器根据调用时传入的实参类型和数量来决定调用哪一个重载方法。这是多态的一种表现。

但是 Java 中不存在自定义运算符重载。

{{< spacer >}}
## Variable-length Arguments
从 Java 5 开始，可以使用 **可变参数（Variable-length Arguments）** 来定义一个方法，使其接受任意数量的同类型参数，参数名在方法内部被当作数组使用。

语法为：
```java
function signature(typename... args) {

}
```

例子如：
```java
public static int sum(int... numbers) {
    int total = 0;
    for (int n : numbers) {
        total += n;
    }
    return total;
}


sum();          
sum(1, 2);      
sum(1, 2, 3, 4, 5); 
```

使用可变参数存在限制：
1. 每个方法最多只能有一个可变参数。
2. 可变参数必须是参数列表中的最后一个。
3. 可变参数的类型是固定的（例如 `int...`，不能同时传入 `int` 和 `String`）。

将可变参数声明为 `Object...`，可以传入任何引用类型，但这样在方法内部需要手动进行类型判断和转换。

{{< spacer >}}
## Wrapper Classes
Java 中的基本数据类型不是对象，为了满足相关需求，Java 为每种基本类型提供了一个对应的引用类型，称为**包装类（Wrapper Class）**。它们分别为：`Integer`、 `Long` 、
`Float` 、`Double`、 `Short`、`Byte`、 `Character` 和 `Boolean`，且都是不可变的。

它们主要用于以下场景：
1. 泛型：泛型只接受引用类型，必须写成如 `ArrayList<Integer>`。
2. 允许 null 值：包装类运行 null 值
3. 提供实用方法：包装类提供了大量静态方法，如 `Integer.parseInt()`


在包装类的编译中，存在**自动装箱（Autoboxing）** 与 **自动拆箱（Unboxing）**，它们指的是包装类与基本类型的相互转换。
```java
// 自动装箱
Integer a = 10;          // 编译后：Integer a = Integer.valueOf(10);
// 自动拆箱
int b = a;               // 编译后：int b = a.intValue();
// 方法参数中的自动装箱/拆箱
List<Integer> list = new ArrayList<>();
list.add(5);             // 装箱：list.add(Integer.valueOf(5));
int x = list.get(0);     // 拆箱：int x = list.get(0).intValue();
// 表达式中的自动拆箱
Integer c = 5;
Integer d = 10;
int sum = c + d;         // 拆箱后相加，再装箱赋值给 int（此处为基本类型，无装箱）
```

这一过程由编译器自动实现，主要发生在赋值、运算以及方法调用参数传递等情况。

注意：由于包装类实际是引用，比较时不应使用 `==` 而应使用 `equal()` 方法。同时，如果包装类对象为 null，拆箱时会出现空指针异常。

{{< spacer >}}
## Enum Classes
枚举本质上是一个类，它继承自 `java.lang.Enum`。

枚举类并不是只能有常量，它可以包含成员变量、普通方法、构造函数等，甚至可以实现接口。
```java
public enum Size{
	SMALL("S"), MEDIUM("M"), LARGE("L"), EXTRA_LARGE("XL");
	private String abbreviation;
	Size(String abbreviation) { this.abbreviation = abbreviation; }
	public String getAbbreviation() { return abbreviation; }
}
```

调用如：
```java
System.out.println(Size.EXTRA_LARGE.getAbbreviation()); // 输出: XL
```

枚举类的构造函数默认且必须为私有，不能使用 public 或 protected，否则编译错误。

枚举类也继承了 Object 类的方法。

特别地，枚举类有一个静态方法 `values()`，它会返回一个含有全部元素的数组。如 `Size[] values = Size.values();` 返回一个元素为 `Size.SMALL, Size.MEDIUM, Size.LARGE, Size.EXTRA_LARGE. ` 的数组。

枚举类还有 `ordinal()`，它返回枚举常量的声明顺序。如 `Size.MEDIUM.ordinal()` 返回 1。

{{< spacer >}}
## Record
`record` 是一种特殊的类，它从 Java 14 开始预览，在 Java 16 中正式成为标准特性。它可以减少样板代码，让我们用一行声明就能得到一个不可变、具有值语义的类。

`record Point(double x, double y) { }` 这是一个 `record` 的定义。
它基本等价于
```java
class Point {
private final double x;
private final double y;
public Point(double x, double y) { this.x = x; this.y = y; }
public double x() { return x; }
public double y() { return y; }
// 编译器还会提供 equals、hashCode、toString

}
```

这个 `record` 自动生成了两个实例变量 `x` 和 `y` ，它们被称作**记录组件（Record Components）**，且它们被隐式声明为 `private final`。

`record` 可以拥有自己的静态变量与方法，但是不可含有其他实例字段。

每个 record 都有一个 **规范构造器（Canonical Constructor）**，它负责初始化所有 记录组件。规范构造器可以由编译器隐式生成，也可以显式声明。

可以定义额外的构造器，但必须通过 `this()` 委托给规范构造器：
```java
public record Point(double x, double y) {
    public Point() {
        this(0, 0);
    }
}
```

`record` 中有一种特殊的构造器，称为**紧凑构造器（Compact Constructor）** 用于参数校验和归一化。它省略了参数列表和字段赋值，字段赋值会在末尾自动完成。
```java
public record Point(int x, int y) {
    public Point {
        if (x < 0 || y < 0) {
            throw new IllegalArgumentException("Negative Coordinates Not Allowed");
        }
        // 不需要写 this.x = x; 编译器会自动补上
    }
}
```

访问 `record` 中数据的方法不是 `getXXX` 而是变量名本身，比如这里应该是：
```java
public double x()
public double y()
```

`record` 也含有 `equals()`、`hashCode()` 和 `toString()` 方法。
`record` 隐式继承 `java.lang.Record`，所以不可继承 `extends` 其他类。
`record` 隐式是 `final` 的，因此不能被继承。
`record` 允许嵌套类和实现 `implements` 接口。

{{< spacer >}}
## Package
Java 中使用 **包（Package）** 管理组织 Java 文件，它可以避免类名冲突，并控制访问权限。

### Declaration
`package` 声明必须位于源文件中所有 `import` 和顶层类型声明之前。
如果没有声明 package，则类属于**默认包（Unnamed Package）**。
包名通常全部小写，命名采用域名反转，如 `com.horstmann.corejava`。

### Import
使用 `import` 可以在当前源文件中省略类型的完整限定名。 `import` 语句位于 package 声明之后，类定义之前。
```java
import java.time.*; 	// 导入该包下的所有类
import java.time.LocalDate;		// 导入单个类
import static java.lang.System.*; // 静态导入，导入静态方法和静态字段
```

使用 `*` 对代码的大小没有任何负面的影响，但是这样写并不明确导入了什么类。
另外，`*` 只匹配当前包直接包含的类型，不会递归导入子包。
使用 `java.lang` 包中的类（如 `String`、`System`）无需显式导入，因为 Java 自动导入该包。


### Directory Structure
Java 要求源文件的存放目录与包名一致。
- 包 `com.example.myapp` 对应的目录是 `com/example/myapp`。
- 编译后，`.class` 文件也按照同样的目录结构生成，例如：`com/example/myapp/MyClass.class`。
- 当运行 Java 程序时，类加载器根据包名在 `classpath` 下查找对应的目录。

{{< spacer >}}

## JAR
**JAR（Java Archive）** 是 Java 平台中用于将多个文件打包成一个压缩文件的标准格式。
JAR 文件本质上是一个 ZIP 压缩包，扩展名为 `.jar`。

以下是一些相关常用命令：
```java
jar cvf myapp.jar -C classes/ .  //创建jar文件
java -jar myapp.jar	//运行可执行jar文件
jar tf myapp.jar	// 查看文件内容
jar xf myapp.jar	//提取文件

```

在每个 JAR 文件中，还存在一个用于描述 JAR 包及其内容的文件，称为 **Manifest 文件**。它固定位于 `META-INF/MANIFEST.MF`。

