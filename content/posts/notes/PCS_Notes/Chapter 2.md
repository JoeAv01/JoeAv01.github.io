---
title: "Chapter 2（上）"
weight: 20
---

> [!NOTE]- 本节概览
>

## 2.1 Introduction

### Instruction Set
**指令系统（Instruction Set）**：The repertoire of instructions of a computer

书上的定义是被一个给定体系结构所理解的命令词汇表。

- 不同的计算机有不同的指令系统，但是在一些方面有相似之处
	- 早期计算机有十分简单的指令系统，受制于集成电路等因素
	- 随着技术的进步而越来越复杂（x86）。
	- 现代计算机也有简单的指令系统（MIPS、RISC-V）

- 储存程序思想：指令与多种类型的数据不加区别地存储在存储器中并因此易于更改，因此产生了存储程序计算机

### The RISC-V Instruction Set
- RISC-V 是由 UC Berkeley 开发的开源的 ISA。本书使用 RISC-V。
- 其设计理念为：简洁、模块化和可扩展性
- 类似的 ISA 在嵌入式核心市场上有很大的份额。

接下来是对 RISC-V 的介绍
### 32 Registers
- 这里的“32 个寄存器”指 `x0`–`x31` 这 32 个整数寄存器。RV32 中每个寄存器为 32 位，RV64 中为 64 位；本章后续主要使用 RV64 的例子。
- RISC-V 采用加载／存储架构：算术指令不直接操作内存中的数据，而是使用寄存器中的数据或指令中的立即数；访问内存需要 load/store 指令。
- 除恒为 0 的 `x0` 外，下表中的用途主要是 ABI（应用程序二进制接口）的调用约定，并非硬件将每个寄存器限定为唯一用途。

| 寄存器编号 | ABI 名称 | 约定用途 | 保存方 |
| :--- | :--- | :--- | :--- |
| `x0` | `zero` | 常量 0，写入会被忽略 | 不适用 |
| `x1` | `ra` | 返回地址 | 调用者 |
| `x2` | `sp` | 栈指针 | 被调用者 |
| `x3` | `gp` | 全局指针 | 不分配 |
| `x4` | `tp` | 线程指针 | 不分配 |
| `x5`–`x7`、`x28`–`x31` | `t0`–`t2`、`t3`–`t6` | 临时寄存器 | 调用者 |
| `x8` | `s0` / `fp` | 保存寄存器，也可用作帧指针 | 被调用者 |
| `x9`、`x18`–`x27` | `s1`、`s2`–`s11` | 保存寄存器 | 被调用者 |
| `x10`–`x11` | `a0`–`a1` | 函数参数或返回值 | 调用者 |
| `x12`–`x17` | `a2`–`a7` | 函数参数 | 调用者 |

“调用者保存”指调用者如果在函数调用后仍需要原值，应在调用前自行保存；“被调用者保存”指被调用者如果修改了该寄存器，应在返回前恢复。`gp` 和 `tp` 不分配给普通临时变量。

浮点寄存器 `f0`–`f31` 属于另一组寄存器，不计入上面的 32 个整数寄存器。

### Instructions

> [!NOTE]- 指令概览
>
> | 类别          | 英文名称 (中文含义)                        | 指令              | 含义/操作                    |
> | :---------- | :--------------------------------- | :-------------- | :----------------------- |
> | **算术运算**    | add (加法)                           | add x5, x6, x7  | x5 = x6 + x7             |
> |             | subtract (减法)                      | sub x5, x6, x7  | x5 = x6 - x7             |
> |             | add immediate (立即数加法)              | addi x5, x6, 20 | x5 = x6 + 20             |
> |             | ......                             |                 |                          |
> | **数据传送**    | load double word (加载双字)            | ld x5, 40(x6)   | x5=Mem[x6+40]            |
> |             | store double word (存储双字)           | sd x5, 40(x6)   | Mem[x6+40]=x5            |
> |             | load word (加载字)                    | lw x5, 40(x6)   | x5=Mem[x6+40]            |
> |             | load word unsigned (加载无符号字)        | lwu x5, 40(x6)  | x5=Mem[x6+40]            |
> |             | store word (存储字)                   | sw x5, 40(x6)   | Mem[x6+40]=x5            |
> |             | load upper immediate (加载高 20 位立即数) | lui x5, 0x12345 | x5=0x12345000            |
> |             | ......                             |                 |                          |
> | **逻辑和移位运算** | and (按位与)                          | and x5, x6, x7  | x5 = x6 & x7             |
> |             | or (按位或)                           | or x5, x6, x7   | x5 = x6 \| x7            |
> |             | xor (按位异或)                         | xor x5, x6, x7  | x5 = x6 ^ x7             |
> |             | shift left logical (逻辑左移)          | sll x5, x6, x7  | x5 = x6 << x7            |
> |             | shift right logical (逻辑右移)         | srl x5, x6, x7  | x5 = x6 >> x7            |
> |             | shift right arithmetic (算术右移)      | sra x5, x6, x7  | x5 = x6 >> x7            |
> |             | ......                             |                 |                          |
> | **条件分支**    | branch on equal (相等时分支)            | beq x5, x6, 100 | if (x5==x6) go to PC+100 |
> |             | branch on not equal (不相等时分支)       | bne x5, x6, 100 | if (x5!=x6) go to PC+100 |
> |             | ......                             |                 |                          |
> | **无条件跳转**   | jump and link (跳转并链接)              | jal x1, 100     | x1=PC+4; go to PC+100    |
> |             | jump and link register (寄存器跳转并链接)  | jal x1, 100(x5) | x1=PC+4; go to x5+100    |
> |             |                                    |                 |                          |

这张表就是 ppt 里的，需要注意 ppt 里把 `store double word` 写成了 `sw`，实际上是 `sd`。

- **字（word）**：32 位，即 4 字节。表中的 `lw`、`sw` 分别读取和存储一个字。
- **双字（doubleword）**：64 位，即 8 字节。表中的 `ld`、`sd` 分别读取和存储一个双字；即使在 RV64 中，一个字仍是 32 位。
- **程序计数器（PC，Program Counter）**：保存当前指令的地址，通常随指令执行顺序前进；分支或跳转指令可以改变后续执行的位置。PC 不属于前面列出的 `x0`–`x31` 整数寄存器。

了解这些基本概念后，下面从最常见的算术操作开始，看看 RISC-V 指令如何完成计算。

## 2.2 Operations of the Computer Hardware

### Arithmetic and Register Operands

1\. Arithmetic Operations
加减操作都使用三个操作数，所有算术运算都是这个形式，第一个是目的操作数，后两个是源操作数

e.g. `add a, b, c  // a gets b + c`

其中//之后的是注释

> [!TIP] 设计原则 1：简洁源于规整（Simplicity favors regularity）
>
> - 规整使得实现更简单
> - 简单实现低成本下的高性能

2\. R-type Instruction

R 型指令（R-type Instruction）是 RISC-V 中用于寄存器间运算的一种指令格式：它从源寄存器 `rs1`、`rs2` 读取操作数，将运算结果写入目标寄存器 `rd`。

```asm
op rd, rs1, rs2
```

这里的 `op` 表示具体的运算指令名，例如 `add`。

它的特点包括：
- 这类指令不需要立即数（immediate value）、目标偏移量（target offset）、内存地址位移（memory address displacement）或内存地址来指定操作数。
- 主要包含算术（arithmetic）、逻辑（logic）和移位（shift）指令，并且所有的操作数都存储在寄存器（registers）中
- R 型指令使用操作码 `0110011`（普通整数运算）和 `0111011`（32 位字操作）。

来看一个例子

{{< center-image src="images/pcs/2.2.2.png" alt="R-type instruction format" width="70%" >}}
- 这是一个 R 型指令，总长度为 32 位，分为 6 个字段
- funct7、funct3 为功能码用于区分同类型的不同指令
- opcode 为7位操作码
- 箭头展示了汇编指令中的寄存器与机器码中对应字段的映射关系


3\. Register Operands
RISC-V 有 32 个 64 位的寄存器
- 双字（doubleword）：64-bit data
- 字（word）：32-bit data

> [!TIP] 设计原则 2：更小则更快（Smaller is faster）
>
> 简单来讲，数量过多的寄存器可能会增加时钟周期，因为电信号传输的距离越远，所花费的时间就越长。

> [!NOTE] Register Operand Example
> C code：
>
> `f = (g + h) - (i + j);`
>
> f, ..., j in x19, x20, ..., x23
>
> Compiled RISC-V code:
> ```asm
> add x5, x20, x21
> add x6, x22, x23
> sub x19, x5, x6
> ```



### Memory Access

1\. Memory Operands

寄存器数量有限，数组、结构体和动态分配的复合数据通常需要放在内存中。

RISC-V 的算术指令不直接访问内存：需要使用内存中的值时，先通过 load 将其读入寄存器；计算结果需要保存在内存中时，再通过 store 写回。

{{< center-image src="images/pcs/2.3.2.png" alt="load-store operations" width="70%" caption="（ppt上把sd写成了sw）" >}}

内存按字节编址，每个地址对应一个 8 位字节。访问相邻元素时，地址按元素大小递增。

字节序决定多字节数据中的各个字节如何排列在内存中。一个双字占 8 个连续字节，以其中最低的地址作为双字地址；两种排列方式的区别在于这个地址存放哪一端的字节：

- **大端序（Big Endian）**：数值最左侧的最高有效字节位于最低地址。
- **小端序（Little Endian）**：数值最右侧的最低有效字节位于最低地址。本书讨论的 RISC-V 采用小端序。

通常不必特别考虑字节序；逐字节查看多字节数据时，需要注意字节的排列顺序。下图以四字节数据为例。

{{< center-image src="images/pcs/2.3.1.png" alt="memory operands" width="70%" >}}

在许多体系结构中，字的起始地址必须是4的倍数，双字的起始地址必须是8的倍数。该要求称为对齐限制。

RISC-V 和 x86 不要求 words 在内存对齐，MIPS 对此有限制。

2\. Memory Address

编译器负责安排数据在内存中的布局，并在内部表中记录变量的位置或相对偏移量。生成 load/store 指令时，它会利用这些信息确定访问地址；RISC-V 通常通过“基址寄存器中的地址 + 字节偏移量”计算实际地址。

例如，`long long int d[10]` 的每个元素占 8 字节。如果 `d[0]` 的基地址为 `B`，那么 `d[i]` 的地址就是 `B + i × 8`。


{{< center-image src="images/pcs/2.3.3.png" alt="memory address" width="70%" >}}

ppt上还有一个例子，但是我们直接来看这个作业题：
{{< tabs id="chapter-2-exercise-2-3" label="作业 2.3" variant="example" open="false" >}}

{{% tab title="题目" %}}
对于以下C语句，请编写相应的RISC-V汇编代码。

假设变量 f、g、h、i 和 j 分别分配给寄存器 x5、x6、x7、x28 和 x29。假设数组 A 和 B 的基地址分别在寄存器 x10 和 x11。数组的成员是 long long int。

`B[8] = A[i-j]`
{{% /tab %}}

{{% tab title="答案" %}}
答案：

```asm
sub  x9, x28, x29       // x9 = i - j
slli x9, x9, 3          // x9 = (i - j) * 8，每个数组元素占 8 字节
add  x9, x9, x10        // x9 = A[i-j] 的地址
ld   x8, 0(x9)          // x8 = A[i-j]
sd   x8, 64(x11)        // B[8] = A[i-j]，8 * 8 = 64 字节
```
{{% /tab %}}

{{< /tabs >}}


3\. Registers vs. Memory

寄存器比内存访问速度更快。

对内存中的数据进行运算，通常需要先用加载（load）指令将其读入寄存器，必要时再用存储（store）指令写回内存，因此可能需要执行更多指令。

编译器会尽可能将常用的变量分配在寄存器中。寄存器数量有限时，部分变量需要暂时存入内存，这称为**溢出（spill）**。如果频繁使用的变量被溢出，之后使用它们就需要再次加载，增加指令数量和内存访问。

因此，**寄存器优化非常重要！**

### Constants in Instructions

1\. Immediate Operands

一条指令可能需要一个常量作为输入。直接写在指令中的常量称为**立即数（immediate）**。例如，`addi x22, x22, 4` 将寄存器 `x22` 的值加 4，再写回 `x22`。

RISC-V 没有单独的减立即数指令，可以用加相反数实现减法：`addi x22, x22, -4` 表示将 `x22` 的值减 4。

> [!TIP] 设计原则 3：加速经常性事件（Make the common case fast）
>
> 小常量很常见。把它作为立即数写入指令，可以避免先用加载指令从内存中读取该常量。

2\. The Constant Zero

寄存器 `x0` 的值始终为常量 0，无法被覆盖。利用这个特性，可以完成一些常见操作，例如将一个寄存器中的值复制到另一个寄存器：

```asm
add x22, x23, x0  // x22 = x23 + 0
```

这里的 `add` 是实际指令；寄存器复制也可以写成伪指令 `mv x22, x23`。





## 2.3 Number Systems and Base Conversions
### Unsigned Binary Integers
无符号二进制数
$$
x = x_{n-1}2^{n-1} + x_{n-2}2^{n-2} + \cdots + x_1 2^1 + x_0 2^0
$$
- 范围为 0 ~ \(2^n-1\)
- 最低有效位（least significant bit，LSB）：指的是最右边的位
- 最高有效位（most significant bit，MSB）：指的是最左边的位

例如，同一个数可以用不同进制表示：

- Decimal \({35}_{10} = 3 \times 10^1 + 5 \times 10^0\)
- Binary \({00100011}_2 = 1 \times 2^5 + 1 \times 2^1 + 1 \times 2^0\)
- Hexadecimal \(\texttt{0x23} \text{ or } {23}_{16}= 2 \times 16^1 + 3 \times 16^0\)

### Conversions of numbers
1\. 二、八、十六进制的转换：

- 转换的核心是：一位八进制数对应 3 位二进制，一位十六进制数对应 4 位二进制。
- 二 → 八：以小数点为界，整数部分从右向左、小数部分从左向右，每 3 位一组；不足时分别在整数部分左侧、小数部分右侧补 0，再将每组转为八进制。
- 八 → 二：每位八进制展开为 3 位二进制。
- 二 → 十六：按同样方向每 4 位一组，不足时补 0，再将每组转为十六进制。
- 十六 → 二：每位十六进制展开为 4 位二进制。
- 八 ↔ 十六：先转二进制，再转换为对应进制。

例子：
$$
{0.10101}_2 = {000.101\,010}_2 = {0.52}_8
$$
$$
{11001.11}_2 = {0001\,1001.1100}_2 = {19.c}_{16}
$$
2\. R 进制数转换为十进制

按“权”展开(a power of R)
例子：
$$
{10101.01}_2 = 1\times2^4+1\times 2^2+1\times2^0+1\times2^{-2} =
{21.25}_{10}
$$
$$
{3a.1}_{16} = 3\times16^1+10\times16^0+1\times16^{-1} = {58.0625}_{10}
$$



3\. 十进制转换为二进制

整数部分和小数部分分别转换：
- 整数：“除基取余，上右下左”
- 小数：“乘基取整，上左下右”
- 有可能乘积的小数部分总得不到0 ，说明是一个无限小数，此时得到一个近似值。
> [!NOTE]- 例子
> {{< center-image src="images/pcs/2.4.1.png" alt="decimal to binary conversion" width="70%" >}}

实际上可以使用 2 的幂的组合来简便转换为二进制数，再按需转换
为 8/16 进制数：
$$
4123.25 = 4096+16+8+2+1+0.25 = {1\,0000\,0001\,1011.01}_2 = {101b.4}_{16}
$$
$$
4023=(4096-1)-64-8={1111\,1111\,1111}_2-{100\,0000}_2-{1000}_2 ={1111\,1011\,0111}_2 = {fb7}_{16}
$$

## 2.4 Encoding of integers

### 2s-Complement Signed Integers
计算机使用补码来表示有符号整数。补码表示能实现 + 和 – 的统一：
$$
x = -x_{n-1}2^{n-1} + x_{n-2}2^{n-2} + \cdots + x_1 2^1 + x_0 2^0
$$
范围: \([-2^{n-1}, 2^{n-1}-1]\)，\(2^{n-1}\) 无法表示

- 最高位为符号位，如果是 64 位则第 63 位是符号位
	- 符号位 1 表示负数，0 表示非负数

- 非负数的补码与原码一样
- 一个负数的补码等于对应正数补码的“各位取反、末位加 1”（使用取模理解）
	- 结论 1：一个负数的补码等于模减该负数的绝对值。数 \(x\) 的相反数 \(-x\) 的二进制补码是 \(2^n-x\)
	- 结论 2：对于某一确定的模，数 \(x\) 减去小于模的数 \(y\)，总可以用数 \(x\) 加上 \(-y\) 的补码来代替。

- 在固定的 \(n\) 位补码表示中，如果 \(\bar{x}\) 表示对 \(x\) 按位取反，有
$$ x + \bar{x} = {11\ldots11}_2 = -1 $$
$$ -x = \bar{x} + 1 $$

- 一些特殊的二进制补码数
	- 0: 0000 0000 … 0000
	- –1: 1111 1111 … 1111
	- Most-negative: 1000 0000 … 0000
	- Most-positive: 0111 1111 … 1111

### Sign Extension
有时我们需要扩展位数。为了在扩展的同时不改变数值，有符号数新增加的高位应该全部填原符号位，无符号数则用 0 扩展。
- 如: 8-bit to 16-bit
	- +2: 0000 0010 => 0000 0000 0000 0010
	- –2: 1111 1110 => 1111 1111 1111 1110
-  In RISC-V
	- lb: 对所加载的字节进行符号扩展
	- lbu: 对所加载的字节进行零扩展
	- addi: 对立即数进行符号扩展
	- beq, bne: 对位移量进行符号扩展

除了补码，还有以下编码方式：

### Sign and Magnitude（原码）
原码：最高位为符号位，其余位表示绝对值。
- 优点：采用符号和幅值表示，容易理解
- 缺点
	- 0 的表示不唯一，不利于程序员编程
	- 加、减运算方式不统一
	- 需额外对符号位进行处理，不利于硬件设计
	- 特别当 a<b 时，实现 a-b 比较困难
	- 现在计算机整数都采用补码来表示，但浮点数的尾数用原码定点小数表示

### 反码和移码
反码（用得少）：一个数的反码就是将这个数的每一位按位取反，0 变成 1，1 变成 0；正数 \(x\) 的相反数可表示为 \(2^n-x-1\)。使用 \({10\ldots000}_2\) 表示最小负数，\({01\ldots11}_2\) 表示最大正数。正数和负数数量相同，但保留两个 0：正零（\({00\ldots00}_2\)）和负零（\({11\ldots11}_2\)）。

采用反码进行加法时，如果最高位产生进位，还需要将该进位加回最低位。

移码：通过将数加一个偏移量使其具有非负的表示形式。最小的负数用 \({00\ldots000}_2\) 表示，最大的正数用 \({11\ldots11}_2\) 表示，0 一般用 \({10\ldots00}_2\) 表示。

将每一个数值加上一个偏置常数（bias），一般来说，当编码位数为 n 时，取 \(2^{n-1}\)

> [!NOTE]+ 例子
> {{< center-image src="images/pcs/2.5.1.png" alt="biased representation example" width="70%" >}}


用移码来表示指数（阶码）时，便于浮点数加减运算时的对阶操作（比较大小）

> [!NOTE]+ 例子
> {{< center-image src="images/pcs/2.5.2.png" alt="biased exponent example" width="70%" >}}

{{< tabs id="chapter-2-exercise-2-11" label="作业 2.11" variant="example" open="false" >}}

{{% tab title="题目" %}}
假设寄存器 `x5` 保存的值为十进制 `128`，求以下指令中使运算结果发生溢出的 `x6` 取值范围。本题按 64 位有符号整数解释寄存器中的值。

1. `add x30, x5, x6`
2. `sub x30, x5, x6`
3. `sub x30, x6, x5`

{{% /tab %}}

{{% tab title="答案" %}}
答案：

2.11.1 `add x30, x5, x6`

指令执行：

$$x30 = x5 + x6 = 128 + x6$$

由于 `x5` 为正数，因此只有可能发生正溢出。
溢出条件：

$$128+x6>2^{63}-1$$

解得：

$$x6>2^{63}-129$$

由于 `x6` 为整数，因此：

$$\boxed{9223372036854775680\leq x6\leq9223372036854775807}$$

2.11.2 `sub x30, x5, x6`

指令执行：

$$x30=x5-x6=128-x6$$

当 `x6` 为较大的负数时，可能发生正溢出。

溢出条件：

$$128-x6>2^{63}-1$$

解得：

$$x6<129-2^{63}$$

因此：

$$\boxed{-9223372036854775808\leq x6\leq-9223372036854775680}$$

2.11.3 `sub x30, x6, x5`

指令执行：

$$x30=x6-x5=x6-128$$

当 `x6` 为较小的负数时，可能发生负溢出。
溢出条件：

$$x6-128<-2^{63}$$

解得：

$$x6<128-2^{63}$$

因此：

$$\boxed{-9223372036854775808\leq x6\leq-9223372036854775681}$$
{{% /tab %}}

{{< /tabs >}}

## 2.5 Representing Instructions in the Computer

### Representing Instructions
指令以二级制的形式编码，被称为机器码。这种指令的设计被称为指令格式。

RISC-V 的指令都是 32 位的（实际上RISC-V 的压缩扩展还提供 16 位指令）
- 使用少量格式来编码操作码、寄存器编号等。
- 具有规整性

二级制串冗长且难以阅读，通常使用十六进制进行压缩表示，每四位对应十六进制一位
如：eca86420  \(\iff\)  1110 1100 1010 1000 0110 0100 0010 0000


### RISC-V R-format Instructions
{{< center-image src="images/pcs/2.6.1.png" alt="RISC-V R-format" width="70%" >}}
上图是一个 R 型指令的机器码格式。从高位到低位，各字段的含义为：

- `funct7`：7 位功能码，用于进一步区分指令。
- `rs2`：第二个源寄存器的编号，占 5 位。
- `rs1`：第一个源寄存器的编号，占 5 位。
- `funct3`：3 位功能码，用于进一步区分指令。
- `rd`：目标寄存器的编号，占 5 位。
- `opcode`：7 位操作码。

这些字段的位数相加为 32 位。

> [!NOTE]- R 型指令的例子
>
> {{< center-image src="images/pcs/2.6.2.png" alt="R-format instruction example" width="70%" >}}
>
> 图中的 `add x9, x20, x21` 对应 `rd=9`、`rs1=20`、`rs2=21`；`funct7=0`、`funct3=0`、`opcode=51`。将各字段按图示顺序拼接，得到机器码 `0x015A04B3`。

### RISC-V I-format Instructions
I 型格式包含一个 12 位立即数字段，常用于立即数运算和加载指令。
{{< center-image src="images/pcs/2.6.3.png" alt="RISC-V I-format" width="70%" >}}

- `immediate`：12 位立即数，可作为常量操作数，或加到基址上的偏移量。
- `rs1`：源寄存器编号；在加载指令中是基址寄存器编号。
- `funct3`：3 位功能码。
- `rd`：目标寄存器编号。
- `opcode`：操作码。

用于 `addi` 等立即数运算或计算加载地址时，12 位立即数按补码解释，并符号扩展到寄存器位宽；本章使用 RV64，即扩展到 64 位。

> [!TIP] 设计原则 4：好的设计需要适当的折中（Good design demands good compromises）
>
> 加载指令需要指定目标寄存器、基址寄存器和地址偏移量。如果沿用 R 型格式，把偏移量放入一个 5 位寄存器字段，可表示的范围太小，不利于访问数组或数据结构中的元素。
>
> 因此，保持指令长度相同与只采用单一指令格式之间产生了矛盾。
>
> RISC-V 选择让本节讨论的基础指令保持 32 位长度，同时使用不同的指令格式，为立即数留出足够空间。不同格式会使译码复杂化，因此各格式尽可能保持相似。


### RISC-V S-format Instructions
S 型指令：专门用于存储的指令格式。
{{< center-image src="images/pcs/2.6.4.png" alt="RISC-V S-format" width="70%" >}}
S 指令采取不同的立即数格式
- rs1: 基址寄存器编号
- rs2: 源操作数寄存器编号
- immediate: 加到基地址上的偏移量
	- 拆分立即数，以使 rs1 和 rs2 字段始终位于相同位置。保持尽可能相似的指令格式降低了硬件的复杂性。
	- 同样，opcode 和 funct3 字段也总是保持同样的大小并在同一个位置。

指令格式通过操作码字段中的值来区分：每个格式在第一个字段（opcode）中被分配了一组不同的操作码值，以便硬件知道如何处理指令的其余部分。


{{< tabs id="chapter-2-instruction-encoding-example" label="例题：从 C 语句到 RISC-V 机器码" variant="example" open="false" >}}

{{% tab title="题目" %}}
将下面的 C 语句翻译为 RISC-V 汇编指令，再写出各指令的机器码：

```c
A[30] = h + A[30] + 1;
```

已知 `h` 存放在 `x21`，数组 `A` 的基地址存放在 `x10`，每个数组元素占 8 字节（64 位）。下面使用 `x9` 暂存计算结果。
{{% /tab %}}

{{% tab title="汇编" %}}
`A[30]` 相对数组基地址的偏移量为 `30 × 8 = 240` 字节。因此，先读取 `A[30]`，完成加法后再写回同一地址：

```asm
ld   x9, 240(x10)    # x9 = A[30]
add  x9, x21, x9     # x9 = h + A[30]
addi x9, x9, 1       # x9 = h + A[30] + 1
sd   x9, 240(x10)    # A[30] = x9
```
{{% /tab %}}

{{% tab title="编码过程" %}}
四条指令依次采用 I 型、R 型、I 型和 S 型格式。以 `sd` 为例，其 12 位偏移量 `240` 写成二进制是 `0000 1111 0000`。S 型格式将它分成 `imm[11:5] = 0000111`（7）和 `imm[4:0] = 10000`（16）；待存储的数据来自 `rs2 = x9`，基址来自 `rs1 = x10`。

按图中的字段顺序，`sd` 编码为：

```text
imm[11:5]   rs2    rs1   funct3  imm[4:0]  opcode
 0000111   01001  01010    011      10000    0100011
```

将这些位拼接，得到 `0x0E953823`。四条指令的机器码汇总如下：

| 汇编指令 | 格式 | 机器码（十六进制） |
| :--- | :---: | :--- |
| `ld x9, 240(x10)` | I 型 | `0x0F053483` |
| `add x9, x21, x9` | R 型 | `0x009A84B3` |
| `addi x9, x9, 1` | I 型 | `0x00148493` |
| `sd x9, 240(x10)` | S 型 | `0x0E953823` |
{{% /tab %}}

{{< /tabs >}}

### Stored Program Computers
指令和数据都以二进制形式表示，并存储在内存中。处理器从内存取出指令执行，也从内存读写数据，这就是存储程序计算机的基本思想。

{{< center-image src="images/pcs/2.6.10.png" alt="stored-program computer" width="70%" >}}

图中，记账程序、编辑器和 C 编译器以机器码形式存放；工资数据、书本文本和编辑器的 C 源代码则作为数据存放。编译器可以处理源代码并生成机器码，链接器可以组合目标代码，因此程序也能处理其他程序。

标准化的指令集（ISA）使不同计算机能够理解相同的机器码。编译后的程序若要直接运行，还需要兼容的应用程序二进制接口（ABI）和运行环境。


## 2.6 Logical Operations
> [!NOTE]- 常用逻辑运算
> {{< center-image src="images/pcs/2.7.1.png" alt="logical operations" width="70%" >}}

### Shift Operations
- 移位操作：`sll`, `slli`, `srl`, `srli`, `sra`, `srai`
- 逻辑左移：左移，并用 0 填充空位，`slli` 左移 i 位相当于乘以 \(2^i\)（超出寄存器位宽的高位会被丢弃）
- 逻辑右移：右移，并用 0 填充空位，`srli` 右移 i 位相当于除以 \(2^i\)（仅适用于无符号数）
- 算术右移：右移，并用符号位填充空位

### I type Shift Operations
- I 型移位： `slli`, `srli`, `srai`
- immed: 移多少位

下图是 RV64 移位立即数指令的格式，其中 6 位 `immed` 表示移位量。

{{< center-image src="images/pcs/2.7.5.png" alt="RV64 I-type shift instruction format" width="70%" >}}

### AND Operations
- 与运算可用于屏蔽（mask）字中的位（掩码）
	- 选择某些位，将其他位清零

> [!NOTE]- 与运算
> `and x9, x10, x11`
> {{< center-image src="images/pcs/2.7.2.png" alt="AND operation" width="70%" >}}

### OR Operations
- 或运算可用于将一个字中的某些位并入（include）
	- 将某些位设为 1，其余位保持不变

> [!NOTE]- 或运算
> `or x9, x10, x11`
> {{< center-image src="images/pcs/2.7.3.png" alt="OR operation" width="70%" >}}

### XOR Operations
- 异或运算可以进行差异运算
	- 将某些位翻转（0 变 1，1 变 0），其余位保持不变。

RISC-V 没有单独的 NOT 指令，可以通过与全 1 按位异或来实现取反。

> [!NOTE]- 异或运算
> 图中 `x12` 的 64 位全为 1，因此下面的指令相当于对 `x10` 按位取反。
>
> `xor x9, x10, x12`
> {{< center-image src="images/pcs/2.7.4.png" alt="XOR operation" width="70%" >}}

### Extensions of Immediates
- 在 `andi`、`ori`、`xori` 等逻辑立即数指令中，12 位立即数会符号扩展到寄存器位宽；在 RV64 中扩展到 64 位。
- 与立即数做加法运算时，立即数也会进行符号扩展。

{{< tabs id="chapter-2-xor-swap-example" label="例题：不使用临时寄存器交换两个数" variant="example" open="false" >}}

{{% tab title="题目" %}}
在 RV64 中，`x10` 和 `x11` 分别保存两个 64 位数。只使用这两个寄存器，不借助临时寄存器或内存，编写 RISC-V 指令交换它们的值。
{{% /tab %}}

{{% tab title="答案" %}}
```asm
xor x10, x10, x11    # x10 = a ⊕ b，x11 = b
xor x11, x10, x11    # x11 = (a ⊕ b) ⊕ b = a
xor x10, x10, x11    # x10 = (a ⊕ b) ⊕ a = b
```

其中 `a`、`b` 是交换前的值。利用异或的性质 `v ⊕ v = 0`、`v ⊕ 0 = v`，三条指令执行后，`x10` 保存原来的 `b`，`x11` 保存原来的 `a`。

这里使用异或而不使用加减法，是为了避免加法的中间结果可能发生有符号溢出。需要注意：RISC-V 整数加减在溢出时按寄存器位宽回绕，因此加减法交换在该规则下也能成立；异或法无需涉及算术溢出。
{{% /tab %}}

{{< /tabs >}}


## 2.7 Instructions for Making Decisions

### Making Decisions
程序通常按顺序执行，但有时需要根据输入或计算结果选择不同的执行路径。

改变执行顺序的指令主要有两类：
- 条件分支：`beq`、`bne`、`bge`、`bgeu`、`blt`、`bltu` 等，仅在条件满足时跳转。
- 无条件跳转：`jal`、`jalr`，执行时直接转移到目标地址，也可用于过程调用与返回。

### Conditional Operations
条件分支指令在条件满足时跳转到目标标签；否则继续执行下一条指令。
- `beq rs1, rs2, L1`
	- 若 `rs1 == rs2`，跳转到标签 `L1` 所标记的指令。
	- `L1` 是目标位置的符号名称。汇编器根据目标地址和当前分支指令的 PC 计算相对偏移；条件成立时，目标地址等于当前 PC 加上这个偏移量，这就是 PC 相对寻址。分支指令编码省略了偏移量恒为 0 的最低位，因此偏移量以 2 字节为单位表示。
	- 若把编码中的相对偏移字段记为 `offset`，跳转时可写为 `PC = PC + (offset << 1)`。`L1` 用于确定 `offset`，不是左移的操作数。
- `bne rs1, rs2, L1`
	- 若 `rs1 != rs2`，跳转到标签 `L1` 所标记的指令。

> [!NOTE]+ Compiling If Statements
> C code:
> ```c
> if (i == j) f = g + h;
> else f = g - h;
> ```
>
> f, g, … in x19, x20, …
>
> After Compiling:
> ```asm
> bne x22, x23, Else
> add x19, x20, x21
> beq x0,x0,Exit     // unconditional
> Else: sub x19, x20, x21
> Exit: ...      //Assembler calculates addresses
> ```
>
> `bne` 检查的是与 C 代码相反的条件：若 `i != j`，跳到 `Else` 执行减法；若 `i == j`，继续执行加法。加法完成后，无条件跳到 `Exit`，避免再执行 `Else` 中的减法。

> [!NOTE]+ Compiling Loop Statements
> C code:
> `while (save[i] == k) i += 1;`
>
> i in x22, k in x24, address of save in x25
>
> After Compiling:
> ```asm
> Loop: slli x10, x22, 3
> add x10, x10, x25
> ld x9, 0(x10)
> bne x9, x24, Exit
> addi x22, x22, 1
> beq x0, x0, Loop
> Exit: ...
> ```
>
> 前三条指令计算 `save[i]` 的地址并读取其值；左移 3 位表示每个元素占 8 字节。若读出的值不等于 `k`，`bne` 跳到 `Exit`；否则将 `i` 加 1，再跳回 `Loop` 检查下一项。
>


> [!NOTE]- More Conditional Operations
> `blt rs1, rs2, L1`
> `if (rs1 < rs2)` branch to instruction labeled L1
>
> `bge rs1, rs2, L1`
> `if (rs1 >= rs2)` branch to instruction labeled L1
>
> Example:
> C code:
>  `if (a > b) a += 1;`
> a in x22, b in x23
> After Compiling:
> ```asm
> bge x23, x22, Exit     // branch if b >= a
> addi x22, x22, 1
> Exit:
> ```
>
### Basic Blocks
基本块是一段指令序列，具有以下特点：
- 除末尾外，内部没有分支指令
- 除开头外，内部没有分支目标
{{< center-image src="images/pcs/2.8.1.png" alt="basic block" width="70%" >}}

图中蓝色部分表示一个基本块：执行从入口开始，沿着块内指令顺序向下，直到末尾才可能转向其他位置。对照上面的例子，if 示例中的 `add x19, x20, x21` 与紧随其后的无条件跳转构成一个基本块；while 示例中，从 `Loop: slli` 到 `bne` 构成一个基本块，`addi` 和跳回 `Loop` 的指令构成另一个基本块。

- 编译器会识别基本块以进行优化
- 高级处理器可以加速基本块的执行

### Signed vs. Unsigned
- 有符号数比较: `blt`, `bge`
- 无符号数比较: `bltu`, `bgeu`

以下以 32 位数为例，展示同一位模式在两种比较方式下的不同结果：

```text
x22 = 1111 1111 1111 1111 1111 1111 1111 1111
x23 = 0000 0000 0000 0000 0000 0000 0000 0001

有符号比较：x22 < x23，因为 -1 < +1
无符号比较：x22 > x23，因为 4,294,967,295 > 1
```

边界检查的简便方法：
- 将有符号数作为无符号数来处理，是检验 0≤x<y 的一种低开销方法，常用于检查数组的下标是否越界
- 也检查了 x 是不是一个负数

例如：

```asm
bgeu x20, x11, IndexOutOfBounds
```

这里 `x20` 保存下标，`x11` 保存非负的数组长度。若下标大于或等于长度，`bgeu` 会跳转；若下标为负数，其位模式按无符号数解释后会成为很大的正数，也会触发跳转。因此这一条指令就能检查合法范围 `0 ≤ 下标 < 长度`。
