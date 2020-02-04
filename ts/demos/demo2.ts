let walker: Walker;
let walkerStateIndex = 0;
let walkerStates = ["stand"];

function start2() {

    walker = new Walker();



    setTimeout(() => {
        //   walk();
    }, 666);

}


/*
function walk() {

    walkerStateIndex++;
    let sx = walkerStateIndex;
    sx = sx % walkerStates.length;
    walker.currentState = walkerStates[sx];


    setTimeout(() => {
        walk();
    }, 77);
}
*/
