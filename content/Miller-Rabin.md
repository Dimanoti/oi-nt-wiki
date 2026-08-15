---
title: Miller-Rabin 素性判断
description: 大整数素性判断方法之一
slug: Miller-Rabin
aliases:
  - miller-rabin
  - miller_rabin
  - Miller_Rabin
  - MillerRabin
---

## 基本原理

根据费马小定理，若 $n$ 是素数，且 $a$ 不是 $n$ 的倍数，则有

$$
a^{n-1}\equiv 1\pmod n.
$$

但费马小定理的逆命题并不成立：一些合数也可能满足这个同余式。因此，Miller-Rabin 素性判断会进一步检查平方过程中的结果。

对于奇数 $n$，将 $n-1$ 分解为

$$
n-1=d\cdot 2^s,
$$

其中 $d$ 是奇数。

若 $n$ 是素数，则对于任意 $1<a<n$，必然满足以下条件之一：

$$
a^d\equiv 1\pmod n,
$$

或者存在某个 $0\le r<s$，使得

$$
a^{d\cdot 2^r}\equiv -1\pmod n.
$$

如果两个条件都不满足，则可以确定 $n$ 是合数，此时称 $a$ 为 $n$ 的一个见证。

## 算法过程

对于每个选定的底数 $a$：

1. 计算 $x=a^d\bmod n$。
2. 若 $x=1$ 或 $x=n-1$，则当前底数通过检验。
3. 否则重复计算 $x=x^2\bmod n$，最多进行 $s-1$ 次。
4. 若某次得到 $x=n-1$，则当前底数通过检验。
5. 若始终没有得到 $n-1$，则 $n$ 一定是合数。

如果所有选定的底数都通过检验，则认为 $n$ 是素数。

:::info[64 位整数的确定性底数]{open}

对于 $0\le n<2^{64}$，依次使用以下七个底数即可得到确定的结果：

$$
2,\ 325,\ 9375,\ 28178,\ 450775,\ 9780504,\ 1795265022.
$$

也就是说，在 `uint64_t` 范围内，下面的代码不会产生随机误判。

:::

## 代码实现

```cpp
#define ull unsigned long long
ull qpow(ull a, ull b, ull mod);
const ull small_primes[] = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37};
const ull bases[] = {2, 325, 9375, 28178, 450775, 9780504, 1795265022};

bool is_prime(ull n) {
    if (n < 2)  return false;
    for (auto p : small_primes)
        if (n % p == 0) return n == p;
    ull d = n - 1, s = 0;
    while ((d & 1) == 0)
        d >>= 1, s++;
    for (auto a : bases) {
        if (a % n == 0) continue;
        long long x = qpow(a % n, d, n);
        if (x == 1 || x == n - 1)   continue;
        bool passed = false;
        for (int r = 1; r < s; ++r) {
            __uint128_t x2 = (__uint128_t)x * x;
            x = x2 % n;
            if (x == n - 1) {
                passed = true;
                break;
            }
        }
        if (!passed)    return false;
    }
    return true;
}
```


## 正确性与误判概率

若某个底数未通过检验，则 $n$ 一定是合数。

若使用随机底数，对于任意奇合数，一次检验发生误判的概率至多为 $\frac14$。独立进行 $k$ 次检验后，误判概率至多为

$$
\frac{1}{4^k}.
$$

对于 64 位整数，使用前面给出的七个固定底数时，判断结果是确定的，不存在误判。

## 复杂度

一次快速幂需要 $O(\log n)$ 次模乘。

当检验的底数数量为常数时，时间复杂度为

$$
O(\log n),
$$

空间复杂度为 $O(1)$。