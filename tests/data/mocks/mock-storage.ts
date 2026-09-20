import type { GetStorage, SetStorage } from "@/data/protocols/cache";

export class StorageSpy implements GetStorage, SetStorage {
  store = new Map<string, unknown>();

  get(key: string): unknown {
    return this.store.get(key);
  }

  set(key: string, value: object | null): void {
    if (value) {
      this.store.set(key, value);
    } else {
      this.store.delete(key);
    }
  }
}
