import { reactive } from "../../reactivity";
import { watchEffect } from "../apiWatch";
import { nextTick } from "../scheduler";
import { vi } from "vitest";

describe("api: watch", () => {
  it("effect", async () => {
    const state = reactive({ count: 0 });
    let dummy;
    watchEffect(() => {
      dummy = (state as any).count;
    });
    expect(dummy).toBe(0);

    (state as any).count++;
    await nextTick();
    expect(dummy).toBe(1);
  });

  it("stopping the watcher (effect)", async () => {
    const state = reactive({ count: 0 });
    let dummy;
    const stop: any = watchEffect(() => {
      dummy = (state as any).count;
    });
    expect(dummy).toBe(0);

    stop();
    (state as any).count++;
    await nextTick();
    // should not update
    expect(dummy).toBe(0);
  });

  it("cleanup registration (effect)", async () => {
    const state = reactive({ count: 0 });
    const cleanup = vi.fn();
    let dummy;
    const stop: any = watchEffect((onCleanup) => {
      onCleanup(cleanup);
      dummy = (state as any).count;
    });
    expect(dummy).toBe(0);

    (state as any).count++;
    await nextTick();
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(dummy).toBe(1);

    stop();
    expect(cleanup).toHaveBeenCalledTimes(2);
  });
});
