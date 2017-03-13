function test({name, test, callback}) {
  console.log(name, test);
  callback()
}

test({test: 'test01', name: 'Alice', func: ()=>(console.log('func'))})

let a = 9
function test () {

}

if (a && test) {

}
