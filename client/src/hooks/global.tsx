import React from 'react';

import { Server } from '@/lib';


interface IContext {
  server: Server;
}
const Context = React.createContext<IContext | null>(null);


interface IProps {
  server: Server;
}
export const GlobalProvider: React.FC<IProps> = (props) => {
  const value = React.useMemo(() => ({
    server: props.server,
  }), [props.server]);
  return (
    <Context.Provider value={value}>
      {props.children}
    </Context.Provider>
  );
};


export function useGlobal () {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error('global context is not ready');
  }
  return context;
}
