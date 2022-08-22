import { Amazons } from "../amazons";

const amz = Amazons();

console.log(amz.ascii());
console.log(amz.pieces());

amz.put(3, "a1");

console.log(amz.ascii());
console.log(amz.pieces());
