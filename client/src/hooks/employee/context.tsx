import React from 'react';

import { useInstance } from '@/lib';
import { useGlobal } from '@/hooks/global';
import { ActionType, IEmployee } from './types';


interface IStateContext {
  isFetching: boolean;
  idList: number[];
  employeeDict: Record<number, IEmployee>;
}
const StateContext = React.createContext<IStateContext | null>(null);
interface IActionContext {
  fetchEmployeeList: () => Promise<void>;
  updateEmployee: (id: number, email: string) => Promise<void>;
  deleteEmployee: (id: number) => Promise<void>;
  createEmployee: (username: string, password: string) => Promise<void>;
}
const ActionContext = React.createContext<IActionContext | null>(null);


export const EmployeeProvider: React.FC<{}> = (props) => {
  const {
    state,
    fetchEmployeeList,
    updateEmployee,
    deleteEmployee,
    createEmployee,
  } = useActions();

  return (
    <ActionContext.Provider
      value={{
        fetchEmployeeList,
        updateEmployee,
        deleteEmployee,
        createEmployee,
      }}
    >
      <StateContext.Provider value={state}>
        {props.children}
      </StateContext.Provider>
    </ActionContext.Provider>
  );
};


export function useEmployeeAction () {
  const context = React.useContext(ActionContext);
  if (!context) {
    throw new Error('employee context is not ready');
  }
  return context;
}


export function useEmployeeState () {
  const context = React.useContext(StateContext);
  if (!context) {
    throw new Error('employee context is not ready');
  }
  return context;
}


function useActions () {
  const { server } = useGlobal();

  const [state, dispatch] = React.useReducer(reduce, {
    isFetching: false,
    idList: [],
    employeeDict: {},
  });

  const self = useInstance(() => ({
    get isFetching () {
      return state.isFetching;
    },
  }), [state.isFetching]);

  const fetchEmployeeList = React.useCallback(async () => {
    if (self.current.isFetching) {
      return;
    }

    dispatch({
      type: 'FETCH_LIST_BEGIN',
      value: null,
    });

    try {
      const employeeList = await server.listEmployees();
      dispatch({
        type: 'FETCH_LIST_END',
        value: employeeList,
      });
    } catch (e) {
      dispatch({
        type: 'ERROR',
        value: e,
      });
    }
  }, [dispatch, self, server]);

  const updateEmployee = React.useCallback(async (id: number, email: string) => {
    if (self.current.isFetching) {
      return;
    }

    dispatch({
      type: 'UPDATE_BEGIN',
      value: id,
    });

    try {
      const employee = await server.updateEmployee(id, email);
      dispatch({
        type: 'UPDATE_END',
        value: employee,
      });
    } catch (e) {
      dispatch({
        type: 'ERROR',
        value: e,
      });
    }
  }, [dispatch, self, server]);

  const deleteEmployee = React.useCallback(async (id: number) => {
    if (self.current.isFetching) {
      return;
    }

    dispatch({
      type: 'DELETE_BEGIN',
      value: null,
    });

    try {
      await server.deleteEmployee(id);
      dispatch({
        type: 'DELETE_END',
        value: id,
      });
    } catch (e) {
      dispatch({
        type: 'ERROR',
        value: e,
      });
    }
  }, [dispatch, self, server]);

  const createEmployee = React.useCallback(async (username: string, password: string) => {
    if (self.current.isFetching) {
      return;
    }

    dispatch({
      type: 'CREATE_BEGIN',
      value: null,
    });

    try {
      const employee = await server.createEmployee(username, password);
      dispatch({
        type: 'CREATE_END',
        value: employee,
      });
    } catch (e) {
      dispatch({
        type: 'ERROR',
        value: e,
      });
    }
  }, [dispatch, self, server]);

  return {
    state,
    fetchEmployeeList,
    updateEmployee,
    deleteEmployee,
    createEmployee,
  };
}


function reduce (state: IStateContext, action: ActionType): IStateContext {
  switch (action.type) {
    case 'FETCH_LIST_BEGIN': {
      return {
        ...state,
        isFetching: true,
      };
    }
    case 'FETCH_LIST_END': {
      const employeeList = action.value;
      const employeeDict: Record<number, IEmployee> = {};
      for (const employee of employeeList) {
        employeeDict[employee.id] = employee;
      }
      return {
        ...state,
        isFetching: false,
        idList: employeeList.map((employee) => (employee.id)),
        employeeDict,
      };
    }
    case 'UPDATE_BEGIN': {
      return {
        ...state,
        isFetching: true,
      };
    }
    case 'UPDATE_END': {
      const employee = action.value;
      const { employeeDict } = state;
      employeeDict[employee.id] = employee;
      return {
        ...state,
        isFetching: false,
        employeeDict: { ...employeeDict },
      };
    }
    case 'DELETE_BEGIN': {
      return {
        ...state,
        isFetching: true,
      };
    }
    case 'DELETE_END': {
      const deletedID = action.value;
      const { idList, employeeDict } = state;
      delete employeeDict[deletedID];
      return {
        ...state,
        isFetching: false,
        idList: idList.filter((id) => id !== deletedID),
        employeeDict: { ...employeeDict },
      };
    }
    case 'CREATE_BEGIN': {
      return {
        ...state,
        isFetching: true,
      };
    }
    case 'CREATE_END': {
      const employee = action.value;
      const { idList, employeeDict } = state;
      employeeDict[employee.id] = employee;
      return {
        ...state,
        isFetching: false,
        idList: [...idList, employee.id],
        employeeDict: { ...employeeDict },
      };
    }
    default:
      return state;
  }
}
