import React from 'react';
import { useHistory } from 'react-router-dom';

import { useInstance } from '@/lib';
import { useGlobal } from '@/hooks/global';
import { ActionType, IEmployee } from './types';


interface IStateContext {
  isAuthenticated: boolean;
  user: IEmployee;
}
const StateContext = React.createContext<IStateContext | null>(null);
interface IActionContext {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}
const ActionContext = React.createContext<IActionContext | null>(null);


export const SessionProvider: React.FC<{}> = (props) => {
  const {
    state,
    login,
    logout,
  } = useActions();

  return (
    <ActionContext.Provider
      value={{
        login,
        logout,
      }}
    >
      <StateContext.Provider value={state}>
        {props.children}
      </StateContext.Provider>
    </ActionContext.Provider>
  );
};


export function useSessionAction () {
  const context = React.useContext(ActionContext);
  if (!context) {
    throw new Error('review context is not ready');
  }
  return context;
}


export function useSessionState () {
  const context = React.useContext(StateContext);
  if (!context) {
    throw new Error('review context is not ready');
  }
  return context;
}


function useActions () {
  const { server } = useGlobal();

  const [state, dispatch] = React.useReducer(reduce, {
    isAuthenticated: server.isAuthenticated,
    user: {
      id: 0,
      username: '',
      email: '',
      is_admin: false,
    },
  });

  const login = React.useCallback(async (username: string, password: string) => {
    dispatch({
      type: 'LOGIN_BEGIN',
      value: null,
    });

    try {
      const user = await server.login(username, password);
      dispatch({
        type: 'LOGIN_END',
        value: user,
      });
    } catch (e) {
      dispatch({
        type: 'ERROR',
        value: e,
      });
    }
  }, [dispatch, server]);

  const logout = React.useCallback(() => {
    server.logout();
    dispatch({
      type: 'LOGOUT',
      value: null,
    });
  }, [dispatch, server]);

  React.useEffect(() => {
    dispatch({
      type: 'HEART_BEAT',
      value: server.isAuthenticated,
    });
    if (server.isAuthenticated) {
      server.fetchSelf().then((user) => {
        dispatch({
          type: 'LOGIN_END',
          value: user,
        });
      });
    }
  }, [server, dispatch]);

  return {
    state,
    login,
    logout,
  };
}


function reduce (state: IStateContext, action: ActionType): IStateContext {
  switch (action.type) {
    case 'HEART_BEAT': {
      return {
        ...state,
        isAuthenticated: action.value,
      };
    }
    case 'LOGIN_BEGIN': {
      return {
        ...state,
        isAuthenticated: false,
        user: {
          id: 0,
          username: '',
          email: '',
          is_admin: false,
        },
      };
    }
    case 'LOGIN_END': {
      const user = action.value;
      return {
        ...state,
        isAuthenticated: true,
        user,
      };
    }
    case 'LOGOUT': {
      return {
        ...state,
        isAuthenticated: false,
        user: {
          id: 0,
          username: '',
          email: '',
          is_admin: false,
        },
      };
    }
    default:
      return state;
  }
}
