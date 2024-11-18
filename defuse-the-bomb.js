/**
 * @param {number[]} code
 * @param {number} k
 * @return {number[]}
 */
const decrypt = (code, k) => {
  const result = new Array(code.length)
  
  if (k === 0) {
    return result.fill(0)
  }

  const at = (index) => {
    return code[(index + code.length) % code.length]
  }

  let absK = Math.abs(k)
  let sign = k / absK

  let sum = 0
  for (let x = 1; x <= absK; ++x) {
    sum += at(sign * x)
  }

  let mod1, mod2
  if (k > 0) {
    mod1 = 1
    mod2 = k + 1
  } else {
    mod1 = k
    mod2 = 0
  }

  for (let i = 0; i < code.length; ++i) {
    result[i] = sum
    sum -= at(i + mod1)
    sum += at(i + mod2)
  }

  return result
}
