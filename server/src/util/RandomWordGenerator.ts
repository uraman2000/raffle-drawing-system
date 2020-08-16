export function RandomWordGenerator() {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890/[]-)(*&^%$#@!";
  const maximum = 10;
  const minimum = 5;
  var randomLenght = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
  const lengthOfCode = 40;
  let text = "";
  for (let i = 0; i < randomLenght; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
