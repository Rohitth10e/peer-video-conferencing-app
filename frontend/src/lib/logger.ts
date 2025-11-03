// Centralized logger that only outputs detailed console logs in development mode.
const isDev = import.meta.env.MODE === 'development';

export const logError = (...args: unknown[]) => {
  if (isDev) {
    console.error('[Dev Log]:', ...args);
  }
};

export const logInfo = (...args: unknown[]) => {
  if (isDev) {
    console.info('[Dev Log]:', ...args);
  }
};
