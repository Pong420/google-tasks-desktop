export class UUID {
  private count: number = 0;

  next() {
    this.count++;
    // to string avoid conflict with index
    return String(this.count);
  }

  reset() {
    this.count = 0;
  }
}
