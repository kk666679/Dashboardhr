export function safeError(error: unknown): string {
  if (process.env.NODE_ENV === 'production') {
    return 'An internal error occurred';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return String(error);
}

export function logError(error: unknown, context?: string): void {
  if (process.env.NODE_ENV === 'production') {
    // Log to monitoring service (e.g., Sentry, Datadog)
    console.error('[ERROR]', context || 'No context', error);
  } else {
    console.error('[ERROR]', context || 'No context', error);
  }
}

export function createErrorResponse(error: unknown, status: number = 500): Response {
  logError(error);
  
  return new Response(
    JSON.stringify({
      error: safeError(error),
      status,
      timestamp: new Date().toISOString(),
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
