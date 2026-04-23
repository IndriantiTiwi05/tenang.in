const globalForHistory = globalThis as unknown as {
  history: any[];
};

export const history =
  globalForHistory.history || (globalForHistory.history = []);