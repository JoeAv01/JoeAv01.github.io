---
title : Generic Programming and Collections
weight : 50
---
这一节包含泛型编程、迭代器与比较器，以及 `Collections` 。

## Generic Programming
使用**泛型编程（Generic Programming）** 可以提高代码复用率，减少重复代码。

### Generic Classes
```java
public class Pair<T> {
	private T first;
	private T second;
	public Pair() { first = null; second = null; }
	public Pair(T first, T second) { this.first = first;
	this.second = second; }
	public T getFirst() { return first; }
	public T getSecond() { return second; }
	public void setFirst(T newValue) { first = newValue; }
	public void setSecond(T newValue) { second = newValue; }
}
```

这是一个泛型类的例子。其中 `T` 是**类型参数（Type Parameter）**，类型参数也可是多个，如 `public class Pair<T, U> {}`

将类型参数替换为具体的类型就可以实例化这个类，如 `Pair<String>`，可以理解为把所有的 `T` 都替换为了 `String`。


### Generic Interface
**泛型接口（Generic Interface）** 和泛型类基本一致：
```java
public interface Repository<T, ID> {
    T findById(ID id);
    void save(T entity);
}
```

实现时可以指定具体类型：、
```java
public class UserRepository implements Repository<User, Long> {
    public User findById(Long id) { ... }
    public void save(User user) { ... }
}
```


### Generic Methods
**泛型方法（Generic Methods）** 的类型参数声明在方法返回类型之前：
```java
public static <T> T getMiddle(T... a) {
	return a[a.length / 2];
}
```

在信息足够的情况下，调用时编译器可以进行类型推断：
```java
String middle = getMiddle("John", "Q.", "Public"); // 无需<String>
```

当实参类型不完全一致时，编译器会尝试推断它们的公共类型。某些目标类型可能使推断结果无法满足赋值要求，因此编译失败，比如 `double middle = getMiddle(3.14, 1729, 0);` 。


### Bounds for Type Variables
有时，我们需要限制类型变量的范围：
```java
public static <T extends Comparable <? super T> T min(T[] a) 
```
此时 `T` 只能为 `Comparable` 的子类。

也可以有多边界：`<T extends Number & Comparable<T>>`
注意：类只能有一个，且必须放在第一个；接口可以有多个。


### Type Erase
Java 泛型是编译期特性，运行时类型参数会被擦除，这叫类型擦除。
运行时，`List<String>` 和 `List<Integer>` 都是 List。

擦除规则大致是：
- 无界类型参数擦除为 Object
- 有界类型参数擦除为第一个边界，例如 `<T extends Number>` 擦除为 Number
- 编译器自动插入强制类型转换
- 必要时生成桥方法保证多态

### Wildcard Types
通配符 `?` 用于表示未知类型，分为无界、上界和下界三种。

- 无界：
```java
public void printList(List<?> list) {	
    for (Object o : list) {
        System.out.println(o);
    }
}
```
可以接受 `List<String>`、`List<Integer>` 等。

- 上界：`? extends T` 表示“某种 T 的子类型”，适合读取数据。
```java
public static double sum(List<? extends Number> list) {
    double total = 0;
    for (Number n : list) {
        total += n.doubleValue();
    }
    return total;
}
```
可以传入 `List<Integer>`、`List<Double>`。
但不能写入非 null 元素，因为编译器不知道具体是哪种 `Number` 子类型。

- 下界：`? super T` 表示“某种 T 的父类型”，适合写入数据。
```java
public static void addIntegers(List<? super Integer> list) {
    list.add(1);
    list.add(2);
}
```
可以传入 `List<Integer>`、`List<Number>`、`List<Object>`。
但读取时只能保证是 `Object`。

### Restrictions and Limitations
1. 泛型的类型实参不能是基本类型。，必须使用包装类
2. 不能直接实例化类型参数
3. 不能创建具体泛型数组
4. 不能对具体泛型类型使用 `instanceof`
5. 静态成员不能使用类的类型参数
6. 不能 `catch` 类型参数，但可以 `throws T`
7. 泛型类不能继承 Throwable
8. 泛型重载可能冲突，如：
```java
void print(List<String> list) { }
void print(List<Integer> list) { } // 编译错误，擦除后都是 print(List)
```

### Inheritance Rules for Generic Types
泛型是不变的。即使 `Integer` 是 `Number` 的子类，`List<Integer>` 也不是 `List<Number>` 的子类型。
```java
List<Integer> ints = new ArrayList<>();
List<Number> nums = ints; // 编译错误
```

{{< spacer >}}
## Iterator
**迭代器（Iterator）** 是遍历集合元素的标准方式。Java 中对应的核心接口是 `java.util.Iterator` 和 `java.util.Iterable`。

### Iterator
`Iterator` 接口
主要方法：
```java
public interface Iterator<E> {
    boolean hasNext();          // 是否还有下一个元素
    E next();                   // 返回下一个元素，并移动游标
    default void remove() {     // 删除 next() 最后返回的元素
        throw new UnsupportedOperationException();
    }
    default void forEachRemaining(Consumer<? super E> action) { ... }
}	// 对剩余元素依次执行指定操作
```

在遍历中，主要用到前两个方法：
```java
import java.util.*;

public class IteratorDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>(List.of("A", "B", "C"));

        Iterator<String> it = list.iterator();
        while (it.hasNext()) {
            String s = it.next();
            System.out.println(s);
        }
    }
}
```

迭代器只能向前，不能回头，也不能重置。需要重新遍历时，要重新调用。

### Iterator and for-each
Java 的 `for-each` 本质上就是迭代器，以下两段代码等价：
```java
for (String s : list) {
    System.out.println(s);
}

Iterator<String> it = list.iterator();
while (it.hasNext()) {
    String s = it.next();
    System.out.println(s);
}
```

只要一个类实现了 `Iterable<T>`，就可以使用 `for-each`

### Iterable
`Iterable` 接口：
```java
public interface Iterable<T> {
    Iterator<T> iterator();
    default void forEach(Consumer<? super T> action) { ... }
    default Spliterator<T> spliterator() { ... }
}
```
实际上只需要实现 `iterator()` 这一个抽象方法。
例子：
```java
public class MyContainer<T> implements Iterable<T> {
    private final List<T> data = new ArrayList<>();
    public void add(T item) {
        data.add(item);
    }

    @Override
    public Iterator<T> iterator() {
        return new MyIterator();
    }

    // 独立的成员内部类，专门负责迭代
    private class MyIterator implements Iterator<T> {
        private int cursor = 0; // 当前遍历位置

        @Override
        public boolean hasNext() {
            return cursor < data.size();
        }

        @Override
        public T next() {
            if (!hasNext()) {
                throw new NoSuchElementException();
            }
            return data.get(cursor++);
        }
}
```


### remove( )
遍历时如果想删除元素，应当使用迭代器自己的 `remove()`：
```java
List<Integer> list = new ArrayList<>(List.of(1, 2, 3, 4, 5));

Iterator<Integer> it = list.iterator();
while (it.hasNext()) {
    Integer num = it.next();
    if (num % 2 == 0) {
        it.remove();
    }
}
System.out.println(list); // [1, 3, 5]
```

{{< spacer >}}
## Comparable and Comparator
这两个接口都用于比较对象大小，常用于排序。其中 `Comparable` 是类自己实现的自然排序，`Comparator` 是外部传入的定制排序，。

### Comparable
它位于 `java.lang` 中：
```java
public interface Comparable<T> {
    int compareTo(T o);
}
```

类实现后就拥有了自然排序能力：
```java
class Person implements Comparable<Person> {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public int compareTo(Person other) {
        return Integer.compare(this.age, other.age);
    }
```

排序时不需要额外传比较器：
```java
List<Person> list = new ArrayList<>();
Collections.sort(list); // 按 age 升序
list.sort(null);        // 自然排序
```

`Comparable` 通常只能定义一种“默认排序”。同时需要修改类。如果要排序的类无法修改，就不能用这种方式。

`CompareTo()` 返回值含义为：
- 负数：第一个对象小于第二个对象。
- 0：两个对象相等（）。
- 正数：第一个对象大于第二个对象。
实现时最好使用包装类的 `compare()` 方法，如 `Integer.compare()`

### Comparator
位于 `java.util` 下：
```java
@FunctionalInterface
public interface Comparator<T> {
    int compare(T o1, T o2);
}
```

`Comparator` 是一个函数式接口（在 Advanced Features 一节），可以定义多种排序规则，不需要修改原类。

```java
// 内部类
Comparator<Person> byAge = new Comparator<Person>() {
    @Override
    public int compare(Person p1, Person p2) {
        return Integer.compare(p1.getAge(), p2.getAge());
    }
};

// lambda函数
Comparator<Person> byAge = (p1, p2) -> Integer.compare(p1.getAge(), p2.getAge());

//静态方法comparing()
Comparator<Person> byName = Comparator.comparing(Person::getName);
Comparator<Person> byAge = Comparator.comparingInt(Person::getAge);

```

它的核心抽象方法只有 `compare()`。
它需要满足全序的性质：
- 反对称性：`sgn(compare(x, y)) == -sgn(compare(y, x))`
- 传递性：若 `compare(x, y) > 0` 且 `compare(y, z) > 0`，则 `compare(x, z) > 0`
- 一致性：若 `compare(x, y) == 0`，则对任意 z，`sgn(compare(x, z)) == sgn(compare(y, z))`
- 若 `compare(x, y) == 0`，最好 `x.equals(y)` 也为  true。否则在 `TreeSet`、`TreeMap` 中会认为两个对象相等，但 `HashSet`、`HashMap` 可能认为不相等。

{{< spacer >}}
## Collection and Map 
`Collection` 是单列集合的顶层接口，定义了一组元素的基本操作；`Map` 是键值对集合，两者共同构成 Java 集合框架。


{{< center-image 
    src="images/java/collections.png" 
    alt="collections" 
    width="60%"
>}}

### Collection Methods
```java
public interface Collection<E> extends Iterable<E> {
    int size();	// 获取大小
    boolean isEmpty();	// 判空
    boolean contains(Object o);	// 查询
    Iterator<E> iterator();	// 获取迭代器
    Object[] toArray();		// 转数组
    <T> T[] toArray(T[] a);

    boolean add(E e);	// 添加
    boolean remove(Object o);	// 删除

    boolean containsAll(Collection<?> c);
    boolean addAll(Collection<? extends E> c);
    boolean removeAll(Collection<?> c);
    boolean retainAll(Collection<?> c);	// 仅保留与指定集合相同的元素
    void clear();	// 清空
}
```
很多方法属于可选操作，某些实现可能抛出 `UnsupportedOperationException`

### Concrete Collections
#### List
特点：
- 元素有序，按插入顺序或索引位置。
- 允许重复元素。
- 可以通过下标访问。
- 允许 null，取决于实现。

常用实现：
- `ArrayList`：动态数组，随机访问快，尾部增删快，中间增删慢
- `LinkedList`：双向链表，中间增删快，随机访问慢

示例：
```java
List<String> list = new ArrayList<>();
list.add("A");
list.add("B");
list.add("A");
System.out.println(list.get(0)); // List有get()方法
```

#### Set
特点：
- 不允许重复元素。
- 不保证顺序，除非使用特定实现。
- 判断重复依赖 `equals` 和 `hashCode`，或比较器。

常用实现：
- `HashSet`：底层结构是哈希表，无序，性能好
- `LinkedHashSet`：底层结构是哈希表 + 链表，保持插入顺序
- `TreeSet`	：底层结构是红黑树，元素有序，按自然顺序或 `Comparator`
- `EnumSet`：底层结构是位向量，枚举专用，高效

示例：
```java
Set<Integer> set = new TreeSet<>();
set.add(3);
set.add(1);
set.add(2);
set.add(3);
System.out.print(set); // [1, 2, 3]
```

#### Queue and Deque
特点：
- FIFO（`PriorityQueue` 等除外）
- 有抛出异常和返回特殊值两套方法。

| 操作   | 失败时抛异常      | 失败时返回特殊值  |
| ---- | ----------- | --------- |
| 入队   | `add()`     | `offer()` |
| 出队   | `remove()`  | `poll()`  |
| 查看队首 | `element()` | `peek()`  |

`Deque` 是双端队列，它继承 `Queue`，支持两端插入和删除，可以当队列，也可以当栈。

常用实现：
- `LinkedList`：可作队列，但不推荐
- `ArrayDeque`：双端队列，可作队列或栈，性能好，不允许 null
- `PriorityQueue`：优先级队列，即堆，按优先级出队
- `ConcurrentLinkedQueue`：并发队列

示例：
```java
Queue<String> queue = new ArrayDeque<>();
queue.offer("A");
queue.offer("B");
System.out.println(queue.poll()); // A
```


### Map 
核心方法：
```java
public interface Map<K, V> {
    int size();
    boolean isEmpty();
    boolean containsKey(Object key);
    boolean containsValue(Object value);
    V get(Object key);	    // 根据 key 获取 value
    V put(K key, V value);	// 添加或覆盖键值对
    V remove(Object key);
    void putAll(Map<? extends K, ? extends V> m);
    void clear();

    Set<K> keySet();	    // 获取所有 key 的 Set 
    Collection<V> values();	// 获取所有 value 的 Collection
    Set<Map.Entry<K, V>> entrySet(); // 获取所有键值对的 Set 

    default V getOrDefault(Object key, V defaultValue) {...} // 不存在时返回默认值
    
}
```


常用实现：
1. `HashMap`：
- 底层是数组 + 链表 + 红黑树
- 允许一个 null key，多个 null value。
- 依赖 `hashCode()` 和  `equals()`。
2. `LinkedHashMap`:
- 继承 `HashMap`，额外维护双向链表
- 默认保持插入顺序
- 允许 null key 和 null value
3. `TreeMap`:
- 基于红黑树
- 按 key 排序：自然顺序或 `Comparator`
- 不允许 null key（自然排序时），value 可以 null
- 支持范围查询：`headMap`、`tailMap`、`subMap`
- 支持导航方法：`firstKey`、`lastKey`、`floorKey`、`ceilingKey`、`higherKey`、`lowerKey`

```java
TreeMap<String, Integer> map = new TreeMap<>();
map.put("C", 3);
map.put("A", 1);
map.put("B", 2);
System.out.println(map); // {A=1, B=2, C=3}
System.out.println(map.firstKey()); // A
System.out.println(map.floorKey("B")); // B
```


### Collections Tools
`Collections` 是 `java.util` 下的工具类：
```java
Collections.sort(list);
Collections.sort(list, comparator);
Collections.reverse(list);
Collections.shuffle(list);
Collections.swap(list, i, j);
Collections.max(list);
Collections.min(list);
Collections.binarySearch(list, key);
...
```
