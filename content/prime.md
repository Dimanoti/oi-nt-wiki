---
title: 素数
description: 素数的定义与普通素数判断。
---

## 素数的定义

**素数**是大于 $1$ 的自然数，且它的正因数只有 $1$ 和它本身。

## 普通素数判断

若 $x$ 是合数，则它至少有一个不超过 $\sqrt{x}$ 的因数。

```cpp
bool is_prime(long long x) {
    if (x < 2) return false;

    for (long long i = 2; i <= x / i; ++i) {
        if (x % i == 0) return false;
    }
    return true;
}