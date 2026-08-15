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

Miller-Rabin 素性判断是一个非确定性的素性判断方法。该算法综合利用了[费马小定理](/oi-nt-wiki/费马小定理)和[二次探测定理](/oi-nt-wiki/二次探测定理)。

## 算法过程

记 $n=d·2^s+1$。

对于每个选定的底数 $a$：

1. 计算 $x=a^d\bmod n$。
2. 若 $x=1$ 或 $x=n-1$，则当前底数通过检验。
3. 否则重复计算 $x=x^2\bmod n$，最多进行 $s-1$ 次。
4. 若某次得到 $x=n-1$，则当前底数通过检验。
5. 若始终没有得到 $n-1$，则 $n$ 一定是合数。

如果所有选定的底数都通过检验，则认为 $n$ 是素数。

:::info[64 位整数的确定性底数]{open}

根据前人经验，对于 $0\le n<2^{64}$，依次使用以下七个底数不会出现合数：

$$
2,\ 325,\ 9375,\ 28178,\ 450775,\ 9780504,\ 1795265022.
$$

也就是说，在 `uint64_t` 范围内，使用上述底数的 Miller-Rabin 素性判断不会产生随机误判。

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

对于 64 位整数，使用前面给出的七个固定底数时，判断结果是确定的，不存在误判。

若使用随机底数，对于任意奇合数，一次检验发生误判的概率至多为 $\dfrac14$。独立进行 $k$ 次检验后，误判概率至多为 $\dfrac{1}{4^k}$。

值得注意的是，该算法不能得到一个合数的质因数。对大合数的[质因数分解](/oi-nt-wiki/合数#质因数分解)详见[Pollard-Rho算法](/oi-nt-wiki/Pollard-Rho)。

## 复杂度

当检验的底数数量为常数时，时间复杂度为 $O(\log n)$，空间复杂度为 $O(1)$。