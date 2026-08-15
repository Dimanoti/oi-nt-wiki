---
title: 素数
description: 素数的定义与普通素数判断。
slug: 素数
aliases:
  - prime
  - 质数
---

## 素数的定义

**素数**是大于 $1$ 的自然数，且它的正因数只有 $1$ 和它本身。

因此，$1$ 不是素数。

## 素数判断

若 $x$ 是合数，则它至少有一个不超过 $\sqrt{x}$ 的因数。因此，只需检查区间 $[2,\sqrt{x}]$ 中是否存在 $x$ 的因数。

```cpp
bool is_prime(int x) {
    if (x < 2) return false;

    for (int i = 2; i <= sqrt(x); i++)
        if (x % i == 0) return false;
    return true;
}
```

时间复杂度为 $O(\sqrt{x})$，空间复杂度为 $O(1)$。

对于大素数素性判断，参考 [Miller-Rabin素性判断](/oi-nt-wiki/Miller-Rabin)。
