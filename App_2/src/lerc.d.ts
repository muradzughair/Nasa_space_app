declare module "lerc" {
  interface DecodedLerc {
    width: number;
    height: number;
    pixels: ArrayLike<number>[];
    statistics: { minValue: number; maxValue: number }[];
  }
  const Lerc: { decode(buffer: ArrayBuffer): DecodedLerc };
  export default Lerc;
}
