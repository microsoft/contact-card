export async function delay(ms: number) {
    // tslint:disable-next-line no-string-based-set-timeout
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitNextTick() {
    return delay(0);
}
