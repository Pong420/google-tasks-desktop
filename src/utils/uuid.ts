export class UUID {
  count: number = 0;

  next() {
    return this.count++;
  }

  reset() {
    this.count = 0;
  }
}
