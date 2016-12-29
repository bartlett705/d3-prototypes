function fibb(n) {
  if (n < 2) return 1;
  return fibb(n - 1) + fibb(n - 2);
}
function fibbs(n) {
  return [...Array(n)].map((x, i) => fibb(i));
}
console.log(fibbs(5));
