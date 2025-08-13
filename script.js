// let numbers = [1, 2, 3, 4, 5];
// console.log(numbers);
// let num;

// alert("Welcome to the number array program!");
// confirm("Are you ready to add numbers to the array?");

// do {
//     num = Number(prompt("Enter a number to add to the array:", "0"));
//     numbers.push(num);
//     console.log(numbers);
// }
// while (num !== 0);

// numbers.pop(); // Remove the last element (0)
// console.log("Loop ended");
// console.log("Final array:", numbers);

let boxes = document.querySelectorAll('.box');

function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

boxes.forEach(box => {
  box.addEventListener('click', () => {
    box.style.backgroundColor = getRandomColor();
  });
})


