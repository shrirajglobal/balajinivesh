// Tiny event bus so the merged FAB (StickyCTA) can open the ChatWidget panel
// without prop-drilling or introducing a new state library.
type Listener = (open: boolean) => void;
const listeners = new Set<Listener>();

export const chatBus = {
  open() {
    listeners.forEach((l) => l(true));
  },
  close() {
    listeners.forEach((l) => l(false));
  },
  subscribe(l: Listener) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};
