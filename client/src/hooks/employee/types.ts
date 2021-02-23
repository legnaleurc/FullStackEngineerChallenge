import { EmployeeResponse } from '@/lib';


export interface IEmployee {
  id: number;
  username: string;
  email: string;
}


interface IAction<T, V> {
  type: T;
  value: V;
}


export type ActionType = (
  | IAction<'FETCH_LIST_BEGIN', null>
  | IAction<'FETCH_LIST_END', EmployeeResponse[]>
  | IAction<'UPDATE_BEGIN', number>
  | IAction<'UPDATE_END', EmployeeResponse>
  | IAction<'DELETE_BEGIN', null>
  | IAction<'DELETE_END', number>
  | IAction<'CREATE_BEGIN', null>
  | IAction<'CREATE_END', EmployeeResponse>
  | IAction<'ERROR', Error>
);
