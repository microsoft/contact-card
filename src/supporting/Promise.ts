export async function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitNextTick() {
    return delay(0);
}
