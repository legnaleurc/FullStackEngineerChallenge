import React from 'react';


type EventHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;
type AsyncEventHandler = (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
export function makeEventHandler<T extends readonly unknown[]> (
  handler: EventHandler | AsyncEventHandler,
  dependencies: readonly [...T],
) {
  return React.useCallback(handler, dependencies);
}
