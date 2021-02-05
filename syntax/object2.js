console.log(1)

var f = function f1() {
    console.log(1+1);
    console.log(1+2);
}

var a = [f] // 배열에 f 
a[0]();

var o = {
    func : f
}

o.func();