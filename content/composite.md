---
title: 合数
description: 大于一且不是素数的自然数
slug: 合数
aliases: composite, 质因数分解, 算术基本定理
---

## 合数的定义

**合数**是大于 $1$ 且不是[素数](/oi-nt-wiki/素数.md)的自然数。例如：

$$
12=2^2\times 3,
$$

因此 $12$ 是合数。

## 算术基本定理

任意大于 $1$ 的自然数都可以唯一地分解为若干个素数的乘积，其中不考虑素因子的排列顺序。

算术基本定理在近世代数中的推广见[理想](/oi-nt-wiki/理想)。

## 质因数分解

根据算术基本定理，任意大于 $1$ 的自然数都可以唯一地分解为若干个素数的乘积，其中不考虑素因子的排列顺序。

下面是最简单的质因数分解判断方式。

```cpp
#define ll long long
std::vector<std::pair<ll, int>> factorize(long long x) {
    std::vector<std::pair<ll, int>> factors;
    for (int64 p = 2; p <= sqrt(x); p++) {
        if (x % p != 0) continue;
        int exponent = 0;
        while (x % p == 0)
            x /= p, exponent++;
        factors.push_back({p, exponent});
    }
    if (x > 1)  factors.push_back({x, 1});
    return factors;
}
```

返回结果中的每个二元组 $(p,k)$ 表示质因子 $p$ 的指数为 $k$。

该算法的时间复杂度为 $O(\sqrt{x})$，额外空间复杂度为 $O(\log x)$。