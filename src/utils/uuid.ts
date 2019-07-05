export class UUID {
  count: number = 0;

  next() {
    this.count++;
    return String(this.count);
  }

  reset() {
    this.count = 0;
  }
}
