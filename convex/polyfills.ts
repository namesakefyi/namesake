// Polyfill for MessageChannel, required for react-email in Convex environment
// https://github.com/resend/react-email/issues/1630#issuecomment-2773421899
if (typeof MessageChannel === "undefined") {
  class MockMessagePort {
    onmessage: ((ev: MessageEvent) => void) | undefined;
    onmessageerror: ((ev: MessageEvent) => void) | undefined;

    close() {}
    postMessage(_message: unknown, _transfer: Transferable[] = []) {}
    start() {}
    addEventListener() {}
    removeEventListener() {}
    dispatchEvent(_event: Event): boolean {
      return false;
    }
  }

  class MockMessageChannel {
    port1: MockMessagePort;
    port2: MockMessagePort;

    constructor() {
      this.port1 = new MockMessagePort();
      this.port2 = new MockMessagePort();
    }
  }

  globalThis.MessageChannel =
    MockMessageChannel as unknown as typeof MessageChannel;
}
