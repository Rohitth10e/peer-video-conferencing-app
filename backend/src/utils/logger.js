// Simple development-only logger
// Exports: logError(...args)

const logError = (...args) => {
  try {
    if (process && process.env && process.env.NODE_ENV === 'development') {
      // Prefix so dev logs are easy to spot
      console.error('[Dev Log]:', ...args);
    }
    // In non-development environments, remain silent
  } catch (e) {
    // Defensive: if process is undefined for some reason, swallow errors in production
    // but still try to log the error if console.error exists and we're in dev
    if (typeof console !== 'undefined' && console.error && (typeof process === 'undefined' || (process && process.env && process.env.NODE_ENV === 'development'))) {
      console.error('[Dev Log] (fallback):', ...args, '(logger internal error)', e);
    }
  }
};

export { logError };
