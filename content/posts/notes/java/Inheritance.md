---
title : Inheritance
weight : 30
---
这一节主要讲 Java 中的继承。使用继承，可以使子类直接调用父类的某些属性和方法，减少重复代码。


## GRoE
继承的黄金法则是：子类和父类之间的关系应当是"is-a" 的关系。例如："Dog is a Animal"
因此，Dog 和 Animal 是一个合格的继承关系；而"Cat has a Claw" 这是一个"has-a" 关系，Cat 和 Claw 之间不应构成继承关系。

{{< spacer >}}

## super 
`super` 关键字主要用于访问父类的成员以及调用父类的构造器。
与 `this` 指向当前对象不同，`super` 不是对象引用，而是一个用于指代父类成员的关键字。

`super` 可以用来访问父类中被隐藏的成员变量、调用父类中被覆盖的方法以及调用父类构造器。关于调用父类构造器在后面会详细讲述。
```java
class Animal {
    void makeSound() {
        System.out.println("Animal makes a sound");
    }
}

class Cat extends Animal {
    @Override
    void makeSound() {
        super.makeSound();  // 调用父类方法
        System.out.println("Cat meows");
    }
}
```


{{< spacer >}}
## abstract
`abstract` 是一个关键字，表示“抽象的、不具体的”。它可以修饰类和方法，表示“只定义规范，不提供完整实现”。

它与接口有相似之处，可以用于如当多个类有公共属性和行为，但某些行为需要各自实现等情况。

- 抽象方法
使用 `abstract` 修饰的方法称为抽象方法。如 `public abstract void makeNoise();
`
抽象方法没有方法体，连大括号 {} 都不能写，它只描述能做什么，不描述怎么做。

如果类中有抽象方法，那么这个类必须声明为抽象类。

- 抽象类
使用  `abstract` 修饰的类称为抽象类。如：
```java
public abstract class Animal {
    private String name;

    public Animal(String name) {
        this.name = name;
    }

    public void eat() {
        System.out.println(name + " is eating");
    }

    public abstract void makeNoise();
}
```

抽象类不可实例化，可以由子类继承并实现抽象方法。如果一个子类没有实现父类的所有抽象方法，那么这个子类也必须声明为抽象类。

抽象类并不要求方法都是抽象的，它也可以有构造函数与普通方法，也可以没有抽象方法。

对于抽象类，`abstract` 不能和 `final` 一起使用，但是对于嵌套类 `abstract` 能和 `static` 和 `private` 一起使用。
对于抽象方法， `abstract` 不能和 `static`、`final`、`private` 一起使用。


{{< spacer >}}
## Override
Override 意为重写/覆盖，指的是子类重新定义父类中已经存在的方法。方法名、参数列表都相同，但方法体不同。
与 overload 重载不同，override 发生在父子类之间。

在方法签名前打上 `@Override` 注解，说明此方法被重写。如果因某些原因未成功重写（比如方法名拼写错误），则编译不通过。因此写代码时加上此标签可以避免某些错误。


{{< spacer >}}
继承分为**接口继承（Interface Inheritance）** 和 **实现继承（Implementation Inheritance）**

{{< spacer >}}
## Interface Inheritance
接口继承主要描述的是子类或接口对**类型和能力定义的继承**，也就是告诉一个类或接口“可以做什么”，而不是直接继承具体实现。

一个类可以通过 `implements` 实现接口：
```java
/* 接口 */
public interface Animal {
    void makeNoise();
}

/* 具体类需要实现接口中声明的抽象方法 */
public class Dog implements Animal {
    @Override
    public void makeNoise() {
        System.out.println("bark");
    }
}
```
`interface` 关键字声明 `Animal` 接口
这里 `Dog implements Animal` 表示 `Dog` 满足 `Animal` 中定义的功能。

虽然 `implements` 的字面意思是“实现”，但它并不属于 implementation inheritance。`Dog` 并没有从 `Animal` 中继承 `makeNoise()` 的具体实现，而是需要自己提供实现。


接口之间也可以发生继承。一个接口通过 `extends` 继承另一个接口：
```java
interface Animal {
    void eat();
}

interface Pet extends Animal {
    void play();
}
```

此时 `Pet` 继承了 `Animal` 中定义的方法要求，因此实现 `Pet` 的具体类需要满足 `eat()` 和 `play()` 两个方法的要求。

Java 的接口还支持多继承，即一个接口可以同时继承多个接口：
```java
interface Flyable {
    void fly();
}

interface Swimmable {
    void swim();
}

interface Duck extends Flyable, Swimmable {
    void quack();
}
```

因此，`Duck` 同时继承了 `Flyable` 和 `Swimmable` 的行为契约。

在 Java 8 之后，接口可以包含 `default` 方法，用来给接口方法提供一个**默认实现**，接口实际上也承担了一部分“实现继承”的功能。可以理解为：接口不仅规定“你要有这个方法”，还顺便提供了一个默认版本。
```java
/* 接口 */
public interface Animal {
   default void makeNoise() {
   		System.out.println("...");
   }
}
```
如果继承的子类不重写方法，那么默认使用接口定义的方法。

java 不支持类的菱形继承，但是接口可以存在菱形继承。如果接口都定义了一个同名且签名相同的默认方法，那么实现类（或子接口）就必须**显式重写**这个冲突的方法，以指定到底使用哪一个，或者提供自己全新的实现。

{{< spacer >}}
## Implementation Inheritance
实现继承指子类通过 `extends` 继承父类已有的实现，从而复用父类中的字段和方法。

```java
class Animal {
    public void eat() {
        System.out.println("Animal is eating");
    }
}    
class Dog extends Animal {
    public void bark() {
        System.out.println("Woof");
    }
}
```
此时子类 `Dog` 可以直接调用 `eat` 方法。

子类也可以重写父类的方法：
```java
class Dog extends Animal {
    @Override
    public void eat() {
        System.out.println("Dog eats meat");
    }
}
```
此时调用会执行 `Dog` 中重写后的 `eat` 方法。


{{< spacer >}}
## Constructors in Inheritance
构造函数不会被子类继承，也不可被重写。子类的每个构造函数都必须调用父类的某个构造函数，以完成父类部分的初始化。

使用 `super` 关键字进行父类构造函数的显式调用，如果不显式调用，java 会自动帮你调用。
```java
public Dog() {
	System.out.println("Dog");
}

public Dog() {
   super();  // 必须位于构造函数的第一条语句，否则无法通过编译
   System.out.println("Dog");
}
```
这两段代码是等效的。

同时可以通过传参的方式指定调用的父类构造函数：
```java
/* 调用 Animal(String name) */
public Dog(String name) {
   super(name);
}

/* 调用 Animal() */
public Dog(String name) {
}
```
注意这两个函数调用的构造函数不同。

如果父类没有无参构造函数，子类必须显式调用父类构造函数，否则编译报错。
```java
class Animal {
    Animal(String name) {
        System.out.println(name);
    }
}

class Dog extends Animal {
    Dog() {
        super("Dog");
    }
}
```

{{< spacer >}}

## Object
`Object` 是**所有类的根类**。也就是说，Java 中几乎所有普通类最终都直接或间接继承自 `java.lang.Object`。如：
```java
class Animal {
}
```
虽然无 `extends Object`，但实际上会被编译器默认为继承 `Object`

由于几乎所有类都继承 `Object` ，所有类都可以使用 `Object` 中定义的方法，如：
```java
toString()
equals()
hashCode()
getClass()
```

`Object` 也可以引用任何对象：
```java
Object obj1 = "Hello";
Object obj2 = 123;
Object obj3 = new Person();
```

{{< spacer >}}

## Casting
**向上转型（Upcasting）**：将子类的类型转为父类类型，如：`Animal animal = new Dog();`。
```java
Manager boss = new Manager(. . .);
Employee[] staff = new Employee[3];
staff[0] = boss;
```
这个过程不需要强制类型转换，Java 可以自动完成。

**向下转型（Downcasting）**：将父类的类型转为子类类型。和向上转型不同，向下转型需要显式写类型：
```java
Animal animal = new Dog();
Dog dog = (Dog) animal;
```

类型转换不会改变对象本身，改变的是引用看待对象的类型
因此下面这段代码是错误的，会报 `ClassCastException`
```java
Animal animal = new Cat();
Dog dog = (Dog) animal; //animal本质还是Cat，无法类型转换
```


{{< spacer >}}
## Dynamic Method Dispatch
对于
```java
class Animal {
    public void makeNoise() {
        System.out.println("Animal noise");
    }
}

class Dog extends Animal {
    @Override
    public void makeNoise() {
        System.out.println("bark");
    }
    public void eat() {
        System.out.println("Dog eats");
    }
}
```
有
```java
Animal animal = new Dog();
animal.makeNoise();
```
那么此时 `animal` 应该调用哪一个 `makeNoise()` 方法呢？
答案是 `Dog` 的 `makeNoise()`

要理解这个，我们先理解 java 中的**静态类型**与**动态类型**
静态类型是引用变量在编译时声明的类型，动态类型是引用所指向对象在运行时的实际类型。
在这个例子中，`Animal` 是静态类型 ；`Dog` 是动态类型 。

对于重写的实例方法，编译阶段根据静态类型判断“这个方法能不能调用”；  运行阶段根据动态类型决定“最终执行哪个版本”。
这就是**动态方法分派（Dynamic Method Dispatch）**，它针对的是被重写的实例方法。

如果刚刚调用了 `animal.eat()` 会编译报错。
原因是变量 `animal` 的静态类型是 `Animal`，而 `Animal` 中没有 `eat()`。
类似的 `boss.setBonus(5000);` 可以正常运行，但是 `staff[0].setBonus(5000);` 会报错
所以动态方法选择并不是在运行时可以随便调用子类的所有方法。而是先由静态类型决定有哪些方法可调用，再由动态类型决定被重写的方法执行哪个实现。


{{< spacer >}}
## instanceof
`instanceof` 是一个二元运算符，用于在运行时检查对象或接口是否为某个类的实例。它的返回值为 `boolean` 类型，常用于在向下转型之前进行类型安全性判断以及多态中的类型判断
```java
Animal animal = new Dog();
if (animal instanceof Dog dog) { 
    dog.bark();
}
```

{{< spacer >}}
## Polymorphism
Java 中的多态通常指**子类型多态（Subtype Polymorphism）**。
当一个类继承另一个类，或者实现某个接口时，会建立子类型关系。子类型对象可以被父类型的引用所引用，例如：`Animal animal = new Dog();`

多态的意义在于：**同一个父类型的引用，可以指向不同子类型的对象，并表现出不同的行为。**

例如：
```java
class Animal {
    public void makeNoise() {
        System.out.println("Animal noise");
    }
}
 
class Dog extends Animal {
    @Override
    public void makeNoise() {
        System.out.println("bark");
    }
}

class Cat extends Animal {
    @Override
    public void makeNoise() {
        System.out.println("meow");
    }
}
```

有：
```java
Animal a1 = new Dog();
Animal a2 = new Cat();

a1.makeNoise();   // bark
a2.makeNoise();   // meow
```

虽然 `a1` 和 `a2` 的静态类型都是 `Animal`，但它们分别指向 `Dog` 和 `Cat` 对象，因此调用同一个 `makeNoise()` 方法时，会产生不同的结果。

这就是多态。

需要注意的是，多态并不只依赖类之间的 `extends`。接口实现同样可以建立子类型关系：
```java
interface Animal {
    void makeNoise();
}

  

class Dog implements Animal {
    @Override
    public void makeNoise() {
        System.out.println("bark");
    }
}
```


因此：
**Java 的子类型多态建立在子类型关系之上，而子类型关系可以通过类继承 `extends` 或接口实现 `implements` 建立。**

{{< spacer >}}

## Cases Unable to Be Inherited
1. 类无法被继承的情况：
- `final` 修饰的类
- 枚举类、Record
1. 方法无法被继承或重写的情况
- `final` 方法可以被继承，但不能被重写
- `private` 方法不会被继承，子类无法访问，也无法重写。如果子类定义了同名方法，那是一个新方法，与父类无关（不算重写）。
- `static` 方法可以被继承，但不能被重写。子类可以定义一个同名的静态方法，但这称为“方法隐藏”（hiding），而不是重写
- 如果父类方法没有访问修饰符（即默认包私有），且子类位于不同的包中，则该方法不可见，也无法继承或访问。
3. 字段无法被继承的情况
- `private` 字段
- 当子类位于不同包时，包私有字段（默认访问权限）

{{< spacer >}}

## Sealed Classes
本来这里应该有笔记的，但是我太懒了，最后这一块笔记直接是 ai 补充的（

`sealed` 用于限制一个类或接口可以有哪些**直接子类型**。它从 Java 17 开始成为正式特性。

```java
public sealed class Shape
        permits Circle, Rectangle, Square {
}
```

只有 `permits` 中列出的类能够直接继承 `Shape`：

```java
public final class Circle extends Shape {
}

public sealed class Rectangle extends Shape
        permits FilledRectangle {
}

public non-sealed class Square extends Shape {
}
```

`sealed` 类型的直接子类型必须明确选择以下一种状态：

```
final
    不允许继续继承

sealed
    继续限制其直接子类型

non-sealed
    重新开放继承
```

这是 Java sealed hierarchy 的核心规则。[Oracle Docs](https://docs.oracle.com/javase/specs/jls/se26/html/jls-8.html?utm_source=chatgpt.com)

例如：

```java
sealed class Animal permits Dog, Cat {
}

final class Dog extends Animal {
}

non-sealed class Cat extends Animal {
}
```

此时：

```java
class Bulldog extends Dog { } // error：Dog 是 final

class Persian extends Cat { } // OK：Cat 是 non-sealed
```

接口同样可以声明为 sealed：

```java
sealed interface Shape
        permits Circle, Rectangle {
}
```

其中允许的直接子类型既可以是实现该接口的类，也可以是继续扩展它的子接口。[Oracle Docs](https://docs.oracle.com/en/java/javase/26/docs/specs/jls/jls-9.html?utm_source=chatgpt.com)

另外，`permits` 有时可以省略。如果允许的直接子类型和 `sealed` 类型位于相应的同一 compilation unit，编译器可以推断 permitted subclasses。对于 unnamed module，允许的直接子类型必须位于同一个 package；对于 named module，则必须属于同一个 named module。