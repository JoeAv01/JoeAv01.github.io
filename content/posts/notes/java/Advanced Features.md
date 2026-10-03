---
title : Advanced Featured
weight : 60
---
这一节我们简要介绍 Java 的一些进阶功能。
## \(\lambda\) Expressions
有时我们需要传递“代码块“, 或者说，我们需要将函数当作参数传递或返回，也就是**高阶函数（higher order function）**。但是 Java 中并没有函数指针这样的东西，为了解决问题，我们引入 **\(\lambda\) 表达式（lambda expressions）** 。

Java 的 lambda 表达式是 Java 8 引入的匿名函数，用来更简洁地实现“函数式接口”。Lambda 表达式本身没有独立类型，必须依赖目标类型来推断，例如赋值、方法参数或返回类型。

### Basic Synax
```java
(parameters) -> expression  // 表达式体不需要 return，表达式结果就是返回值。
(parameters) -> { statements; } // 块体需要大括号；如果有返回值，必须显式 return

//具体例子：
(String first, String second) -> first.length() - second.length()
(String first, String second) ->
{
if (first.length() < second.length()) return -1;
else if (first.length() > second.length()) return 1;
else return 0;
}
```

如果没有参数，不可省略括号：
`() -> { for (int i = 100; i >= 0; i--) System.out.println(i); }`

如果只有一个参数，可以省略括号：`x -> 2*x`

如果参数类型可以被推断出来，则可以省略参数类型：
```java
Comparator<String> comp
= (first, second) -> first.length() - second.length();
```

### Functional Interface
**函数式接口（Functional Interface）** 是 Java 8 引入的概念：恰好只有一个抽象方法的接口。它可以有多个默认方法、静态方法，也可以包含与 `Object` 的 public 方法签名相同的方法，但这些都不计入“抽象方法”数量。

函数式接口是 Lambda 表达式和方法引用的目标类型。通常用 `@FunctionalInterface` 注解标记，编译器会检查它是否符合函数式接口规范。该注解不是必须的，但推荐使用。

#### Rules
只能有一个抽象方法。
`default` 方法不计入抽象方法数量。
`static` 方法不计入抽象方法数量。
继承多个接口时，抽象方法必须能合并为同一个。
`Lambda` 只能赋值给函数式接口类型。

#### Built-in Functional Interface
`java.util.function` 有许多内置的函数式接口。以 `BiFunction<T,U,R>` 为例：它的抽象方法是 `R apply(T t, U u)`。它接收 `T`、`U` 两个参数并返回 `R`。那么可以有：
```java
BiFunction<String, String, Integer> comp
= (first, second) -> first.length() - second.length();
```

`Predicate<T>` 是另一个常用的接口。它的抽象方法是 `boolean test(T t)`。 它接收 `T`，返回 `boolean`。`ArrayList` 有一个参数为 `Predicate` 的方法 `removeIf()`。`list.removeIf(e -> e == null);` 这样就可以删去 `list` 中所有的 `null` 值

最后介绍 `Supplier<T>`。它的抽象方法是 `T get()`。它不接受参数，返回 `T`，主要用于延迟计算等。


### Method Reference
**方法引用（Method Reference）** 是 Lambda 表达式的一种更简洁写法。当 Lambda 体只是调用一个已经存在的方法或构造器时，可以用 `::`  来代替 Lambda。

基本语法：`object::method`。如；
```java
System.out::println  // 相当于x -> System.out.println(x)
String::compareToIgnoreCase  // 相当于(x,y) -> x.compareToIgnoreCase(y)
Math::pow  // 相当于(x, y) -> Math.pow(x, y)
```

方法引用也可以用于构造器，它的方法名是 `new`
```java
ClassName::new	//相当于(args) -> new ClassName(args)
int[]::new	// 数组构造器也可以
```
同时也支持使用 `this`、`super` 关键字：
```java
this::method	
super::method
```
方法引用必须依赖目标类型，也就是函数式接口
被引用方法的参数、返回值和异常必须与函数式接口的抽象方法兼容。
方法重载时，编译器会根据目标类型推断具体方法；如果无法确定，会编译报错。

### Variable Scope
lambda 表达式可以捕获外围方法的参数和局部变量。
```java
public static void repeatMessage(String text, int delay) {
	ActionListener listener = event ->
	{	
	System.out.println(text);
	Toolkit.getDefaultToolkit().beep();
	};
	new Timer(delay, listener).start();
	}
}
```
lambda 对局部变量做的是按值捕获，相当于在创建 lambda 时把变量的当前值复制了一份。因此原变量必须是 *final* 或 *effectively final* (即编译过程中值不发生改变)。

同时，lambda 内部不能声明与外层局部变量同名的变量。lambda 中的 this 指向外围类实例，而不是 lambda 自身。



{{< spacer >}}

## Reflection
**反射（Reflection）** 是 Java 中一个强大且复杂的功能，它指的是动态获取信息以及动态调用对象方法的功能。我们只进行一个简略的介绍。

正常情况下，我们写代码时已经知道要操作哪个类、哪个方法。而反射允许我们在运行时才去检查类、创建对象、调用方法，就像照镜子一样，能在运行时看到一个类的内部结构。

反射的核心类位于 `java.lang.reflect` 包中，主要有：`Class` （它位于 `java.lang.Class`）、`Field`、`Method`、`Constructor`、`Modifier`、`Array` 这几个类。其中 ` Class ` 是反射 API 的入口点。

`Class` 类用来表示运行时的一个类或接口。每个类、接口、枚举、注解、数组、基本类型甚至 `void`，在 JVM 中都有一个对应的 `Class` 对象。

`Class` 是泛型类，`Class<T>` 中的 `T` 表示这个 `Class` 对象所代表的类型。

可以通过以下的几种方法获取 `Class` 对象；
- `类名.class` 如 
```java
Class<String> c1 = String.class;
Class<?> c2 = int.class;
``` 

- `getClass()` 方法：
```java
String s = "hello";
Class<?> c = s.getClass();
```

- `Class.forName("全限定类名")` 如：
```java
 Class<?> c=Class.forName("java.lang.String");
```


- `ClassLoader.loadClass("全限定类名")`
```java
ClassLoader loader = ClassLoader.getSystemClassLoader();
Class<?> c = loader.loadClass("java.lang.String");
```

最常用的方法之一是 `getName()`，它能返回类名：
```java
Employee e; ...
Class cl = e.getClass();
System.out.println(e.getClass().getName());
// 将输出Employee
```

如果类是一个 package，则包名是类名的部分：
```java
var generator = new Random();
Class cl = generator.getClass();
String name = cl.getName(); // name = "java.util.Random"
```

虚拟机保证每个类型都有一个唯一的 `Class` 对象，因此可以使用 `==` 比较，如：`if (e.getClass() == Employee.class)`。


`getConstructor()` 方法将获取 `Class` 对象的构造函数，`newInstance()` 方法可以构造一个实例：
```java
var className = "java.util.Random"; 
Class cl = Class.forName(className);
Object obj = cl.getConstructor().newInstance();
```
如果一个类没有无参构造函数，`getConstructor()` 方法将抛出异常。

使用反射，还可以对类的结构进行分析、在运行中对分析对象、激发指定构造器和方法等，这里就不再介绍。


{{< spacer >}}
## Concurrency
对 Java 中的多线程编程做简要的介绍。
### Thread
与进程（process）不同，线程之间共享数据。在 Java 中，线程相关在 `java.lang.Thread` 下。

创建线程的核心步骤是：
1. 定义线程要执行的任务，实现 `Runnable` 中的 `run()`：
2. 创建 `Thread` 对象；
3. 调用 `start()` 启动线程。

以下面的一个例子来看看简单的创建线程方法：
```java
public class ThreadDemo {
    public static void main(String[] args) {
        Runnable task = () -> {
            for (int i = 1; i <= 3; i++) {
                System.out.println(Thread.currentThread().getName() + " do: " + i);
            }
        };

        Thread t1 = new Thread(task, "Thread-A");
        Thread t2 = new Thread(task, "Thread-B");

        t1.start();
        t2.start();

        System.out.println(Thread.currentThread().getName() + " end");
    }
}
```

这是一种可能的输出：
```
main end
Thread-A do: 1
Thread-B do: 1
Thread-A do: 2
Thread-B do: 2
Thread-A do: 3
Thread-B do: 3
```
可以看到，
- 首先 `Runnable` 是一个函数式接口，可以通过 lamda 表达式创建一个实例。
- 接下来利用创建的实例创建线程
- 再使用 `start()` 方法启动线程，一个线程对象只能 `start()` 一次。

#### Thread States
线程有六种状态：
- New：已使用 `new` 创建但尚未启动
- Runnable：可运行/正在运行
- Blocked：等待监视器锁
- Waiting：无限期等待
- Timed waiting：限时等待
- Terminated：已终止


{{< center-image 
    src="images/java/thread.png" 
    alt="thread" 
    width="60%"
>}}

#### Thread Properties
##### Interrupting Threads
Java 中的**线程中断（Interrupting Threads）** 不是强制杀死线程，具体是否停止、如何停止，由目标线程自己决定。核心方法如下：
```java
thread.interrupt()	// 设置目标线程的中断标志；如果目标线程正阻塞在 sleep、wait、join 等方法中，会抛 InterruptedException
thread.isInterrupted()	// 检查目标线程的中断标志，不清除
Thread.interrupted()	// 静态方法，检查当前线程的中断标志，并清除它
```

中断有两种情况：
1. 线程正在运行，此时 `interrupt(`) 只是把中断标志设为 true，可以使用另外两个方法检查状态
2. 线程被阻塞，此时无法使用两个方法检查状态，`interrupt()` 会让这些方法抛出 `InterruptedException`，同时清除中断标志。

注意不要吞掉中断，也不要 `stop()`，该方法已被废止。


##### Daemon Thread
Java 中的**守护线程（Daemon Thread）**，不是操作系统意义上的守护进程。它的核心特点是：不阻止 JVM 退出。创建与判断：
```java
t.setDaemon(true); // 必须在 start() 之前设置
t.isDaemon()
```


##### Thread Priorities
Java 中每个线程都有优先级，默认继承创建它的线程的优先级。
可通过 `setPriority()` 设置优先级，范围为 1 到 10，默认普通优先级是 5。
也有一些常量：
```java
Thread.MIN_PRIORITY
Thread.MAX_PRIORITY
Thread.NORM_PRIORITY
```

理论上，线程调度器偏向于选择优先级更高的线程。实际上，线程优先级高度依赖操作系统和 JVM，可能被合并、映射或完全忽略。

因此，现代 Java 中不应依赖线程优先级来控制调度或执行顺序。

### Synchronization
**同步（Synchronization）** 是用来协调多个线程访问共享资源的机制。

```java
class Counter {
    int count = 0;

    public void increment() {
        count++; // 不是原子操作
    }
}
```
`count++` 实际上分为三步：1. 读取 `count` 2. 加 1 3. 写入 `count`
如果两个线程同时操作，可能会读取同一个旧值，导致无法更新，这就是**竞态条件（Race Condition）** 。

使用 `synchronized` 关键字可以解决这个问题
```java
class Counter {
    int count = 0;

    public synchronized void increment() {
        count++;
    }
}
```

`synchronized` 关键字可以用来修饰实例方法、静态方法与代码块。
`synchronized` 锁是可重入的。同一个线程已经持有某个对象的锁，再次进入该对象的其他同步方法或同步块时，可以直接获得锁，不会死锁。


除了 `synchronized` 内置锁，还 Java 提供了**显式锁**，位于`java.util.concurrent.locks` 包。最常用的是 `Lock` 接口和它的实现类 `ReentrantLock`。显式锁的加锁和释放锁都由代码手动控制，因此更灵活：
```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

class Counter {
    private int count = 0;
    private final Lock lock = new ReentrantLock();

    public void increment() {
        lock.lock();
        try {
            count++;
        } finally {
            lock.unlock(); // 必须在 finally 中释放
        }
    }
}
```

注意：
- 一定要在 `finally` 中 `unlock()`，否则容易死锁。
- `ReentrantLock` 是可重入的，同一个线程可以重复获取。
- 不要滥用显式锁，能用 `synchronized` 解决时则优先用。需要可中断、超时、公平、多条件、读写分离时，再考虑显式锁。



### Thread Cooperation
**线程协作（Thread Cooperation）** 指的是：多个线程之间相互等待、通知、协调执行顺序，共同完成一个任务。

Java 中常见的线程协作方式有：`wait/notify/notifyAll`、`join`、`Condition` 等。

#### wait / notify / notifyAll
这三个方法定义在 `Object` 上，必须在 `synchronized` 块或方法中调用。
- `wait()`：释放锁并进入等待，直到被唤醒或超时
- `notify()`：任意唤醒一个等待该锁的线程。
- `notifyAll()`：唤醒所有等待该锁的线程。

规则：
- 必须用 `while` 检查条件，不能用 `if`，防止虚假唤醒。
- 锁对象要一致。
- `notify()` 不会立即释放锁，要等当前同步块结束。
- 不确定唤醒哪个线程时，优先用 `notifyAll()`。

#### join
`t.join()` 让当前线程等待 t 线程终止。
```java
Thread t = new Thread(() -> {
    System.out.println("子线程执行");
});
t.start();
t.join(); // 主线程等待 t 结束
System.out.println("子线程已结束");
```
#### Condition
`Condition` 配合 `Lock` 使用，类似 `wait` / `notify`，但更灵活。
```java
Lock lock = new ReentrantLock();
Condition notFull = lock.newCondition();
Condition notEmpty = lock.newCondition();

lock.lock();
try {
    while (队列满) {
        notFull.await();
    }
    // 放入元素
    notEmpty.signalAll();
} finally {
    lock.unlock();
}
```



### Thread-Safe Collection
普通集合如 `ArrayList`、`HashMap`、`HashSet` 都不是线程安全的。
现代 Java 更推荐使用 `java.util.concurrent` 中的并发集合


| 类型        | 代表类                                                                                      |
| --------- | ---------------------------------------------------------------------------------------- |
| 并发 Map    | ConcurrentHashMap                                                                        |
| 有序并发 Map  | ConcurrentSkipListMap                                                                    |
| 并发 Set    | ConcurrentSkipListSet                                                                    |
| 写时复制 List | CopyOnWriteArrayList                                                                     |
| 写时复制 Set  | CopyOnWriteArraySet                                                                      |
| 并发队列      | ConcurrentLinkedQueue                                                                    |
| 并发双端队列    | ConcurrentLinkedDeque                                                                    |
| 阻塞队列      | ArrayBlockingQueue、LinkedBlockingQueue、PriorityBlockingQueue、SynchronousQueue、DelayQueue |


## GUI Programming
以后可能会补...
