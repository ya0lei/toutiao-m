const fun2 = () => {
  return function fun3 () {
    console.log('111')
  }
}
const obj = {
  fun: fun2
}
obj.fun()()
