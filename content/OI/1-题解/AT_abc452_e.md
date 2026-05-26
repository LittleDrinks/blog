---
title: AT_abc452_e
description:
tags:
  - OI/题解
aliases:
date: 2026-04-04T22:26:07
publish: true
---
## [AT_abc452_e. You WILL Like Sigma Problem](https://atcoder.jp/contests/abc452/tasks/abc452_e)

$i\bmod j$ 比较难处理，但是和他相关的除法运算有分段的性质，所以考虑转化为
$$
i\bmod j=i-j\times \left\lfloor\frac{i}{j}\right\rfloor
$$
原式变为：
$$
i\cdot A_i\cdot B_j - \left(\left\lfloor\frac{i}{j}\right\rfloor\cdot A_i\right)\cdot (j\cdot B_j)
$$
前半部分枚举 $i$ 可以 $O(n)$ 做掉，后半部分可以 $O(n\log n)$ 枚举 $\lfloor\frac{i}{j}\rfloor$ 做掉。

[***AC 代码***](https://atcoder.jp/contests/abc452/submissions/74695087)

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

const int MOD = 998244353, N = 1e6 + 5;
template<class...T> ll add(T...t){ll r=0;(((r+=t%MOD)>=MOD?r-=MOD:0),...);return(r%MOD+MOD)%MOD;}
template<class...T> ll mul(T...t){ll r=1;((r=r*(t%MOD)%MOD),...);return(r%MOD+MOD)%MOD;}
ll del(ll x,ll y){return add(x,MOD-y);}
ll qpow(ll a,ll b=MOD-2){ll r=1;for(;b;b>>=1,a=mul(a,a))if(b&1)r=mul(r,a);return r;}
ll fac[N + 5], Inv[N + 5];
void preprocess() {
    fac[0] = 1;
    for (int i = 1; i <= N; ++i) fac[i] = mul(fac[i-1], i);
    Inv[N] = qpow(fac[N]);
    for (int i = N - 1; ~i; --i) Inv[i] = mul(Inv[i + 1], i + 1);
}
ll C(ll n, ll m) { return m > n ? 0: mul(fac[n], Inv[m], Inv[n-m]); }
ll P(ll n, ll m) { return m > n ? 0: mul(fac[n], Inv[n-m]); }

int main()
{
    ios::sync_with_stdio(0); cin.tie(0); cout.tie(0); 
    int n, m;
    cin >> n >> m;
    vector<int> A(n + 1), B(m + 1);
    vector<int> s(n + 1);
    int sa = 0, sb = 0;
    for (int i = 1; i <= n; ++i) {
        cin >> A[i];
        s[i] = add(s[i - 1], A[i]);
        sa = add(sa, A[i]);
    }
    for (int j = 1; j <= m; ++j) {
        cin >> B[j];
        sb = add(sb, B[j]);
    }
    int ans = 0;
    for (int i = 1; i <= n; ++i) {
        ans = add(ans, mul(i, A[i], sb));
    }
    for (int j = 1; j <= m; ++j) {
        for (int t = 1; (t - 1) * j <= n; ++t) {
            int l = max(0, (t - 1) * j - 1);
            int r = min(n, t * j - 1);
            int cur = mul(t - 1, del(s[r], s[l]));
            cur = mul(j, B[j], cur);
            ans = del(ans, cur);
        }
    }
    cout << ans << "\n";
}

```
