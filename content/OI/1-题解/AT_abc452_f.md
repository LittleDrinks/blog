---
title: AT_abc452_f
description:
tags:
  - OI/题解
  - OI/数学/容斥原理
  - OI/滑动窗口
aliases:
date: 2026-04-07T20:26:24
publish: true
---
## [AT_abc452_f. Interval Inversion Count](https://atcoder.jp/contests/abc452/tasks/abc452_f)

容斥，记 $f(k)$ 表示逆序数 $\le k$ 的区间数量。
对于一个逆序数不超过 $k$ 的区间 $[l,r]$，区间 $(l,r]$ 和 $[l,r)$ 的逆序数都不超过 $k$，我们可以通过滑动窗口求出每个左端点对应的最右的一个逆序数 $\le k$ 的右端点。于是可以 $O(n)$ 求出 $f(k)$
$f(k)-f(k-1)$ 即为答案。

[***AC 代码***](https://atcoder.jp/contests/abc452/submissions/me)

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
using db = long double;
using i128 = __int128;

template<typename T1,typename T2> ostream& operator<<(ostream& os, const pair<T1,T2>& p) {
    return os<<"("<<p.first<<","<<p.second<<")";
}
template<typename T> ostream& operator<<(ostream& os, const vector<T>& v) {
    os<<"["; for(int i=0;i<v.size();++i) os<<(i?", ":"")<<v[i]; return os<<"]";
}
template<typename T> void gmax(T&x,T y){ x = max(x, y); }
template<typename T> void gmin(T&x,T y){ x = min(x, y); }

struct BIT {
    int n;
    vector<int> t;
    BIT(int n): n(n), t(n + 1) { }
    int lowbit(int x) { return x & -x; }
    void modify(int x, int d) {
        for (; x <= n; x += lowbit(x)) t[x] += d;
    }
    int query(int x) {
        int res = 0;
        for (; x; x -= lowbit(x)) res += t[x];
        return res;
    }
};

int main()
{
    ios::sync_with_stdio(0); cin.tie(0); cout.tie(0); 
    int n;
    ll k;
    cin >> n >> k;
    vector<int> p(n + 1);
    for (int i = 0; i < n; ++i) {
        cin >> p[i];
    }
    auto work = [&](ll num) -> ll {
        BIT t(n);
        int j = 0;
        ll now = 0, ans = 0;
        for (int i = 0; i < n; ++i) {
            if (j < i) j = i;
            while (j < n && now + t.query(n) - t.query(p[j] - 1) <= num) {
                now += t.query(n) - t.query(p[j] - 1);
                t.modify(p[j], 1);
                ++j;
            }
            ans += j - i;
            t.modify(p[i], -1); 
            now -= t.query(p[i]);
        }
        return ans;
    };
    ll ans = work(k) - work(k - 1);
    cout << ans << "\n";
}
```
