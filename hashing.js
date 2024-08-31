class Hashing {
  #N = 100;
  #base1 = 29;
  #base2 = 31;
  #mod1 = 1e9 + 7;
  #mod2 = 1e9 + 9;

  #pw1;
  #pw2;
  #inv1;
  #inv2;
  #pref1;
  #pref2;

  constructor(str) {
    this.#pw1 = new Array(this.#N).fill(1);
    this.#pw2 = new Array(this.#N).fill(1);
    this.#inv1 = new Array(this.#N).fill(1);
    this.#inv2 = new Array(this.#N).fill(1);
    this.#pref1 = new Array(str.length).fill(0);
    this.#pref2 = new Array(str.length).fill(0);
    this.str = str;
    this.#precompute();
    this.#computeHashes(str);
  }


  #precompute() {
    for (let i = 1; i < this.#N; i++) {
      this.#pw1[i] = (this.#base1 * this.#pw1[i - 1]) % this.#mod1;
      this.#pw2[i] = (this.#base2 * this.#pw2[i - 1]) % this.#mod2;
      this.#inv1[i] = this.#power(this.#pw1[i], this.#mod1 - 2, this.#mod1);
      this.#inv2[i] = this.#power(this.#pw2[i], this.#mod2 - 2, this.#mod2);
    }
  }


  #computeHashes(str) {
    let hashValue1 = 0;
    let hashValue2 = 0;
    for (let i = 0; i < str.length; i++) {
      let idx = str.charCodeAt(i) - 'a'.charCodeAt(0) + 1;
      hashValue1 = this.#add(hashValue1, this.#mul(idx, this.#pw1[i], this.#mod1), this.#mod1);
      hashValue2 = this.#add(hashValue2, this.#mul(idx, this.#pw2[i], this.#mod2), this.#mod2);
      this.#pref1[i] = hashValue1;
      this.#pref2[i] = hashValue2;
    }
  }

  #add(a, b, mod) {
    return (a + b + mod) % mod;
  }

  #mul(a, b, mod) {
    return (a % mod * b % mod) % mod;
  }

  #power(a, b, mod) {
    let ans = 1;
    while (b > 0) {
      if (b & 1) {
        ans = (ans * a) % mod;
      }
      a = (a * a) % mod;
      b >>= 1;
    }
    return ans;
  }

  queryHash(l, r) {
    if (l === 0) {
      return [this.#pref1[r], this.#pref2[r]];
    }
    let hash1 = this.#mul(this.#add(this.#pref1[r], -this.#pref1[l - 1], this.#mod1), this.#inv1[l], this.#mod1);
    let hash2 = this.#mul(this.#add(this.#pref2[r], -this.#pref2[l - 1], this.#mod2), this.#inv2[l], this.#mod2);
    return [hash1, hash2];
  }

  getHash() {
    let arr = this.queryHash(0, str.length - 1);
    return `${arr[0]}${arr[1]}`;
  }
}



module.exports = Hashing;
