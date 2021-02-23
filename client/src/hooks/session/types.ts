import { EmployeeResponse } from '@/lib';


export interface IEmployee {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
}


interface IAction<T, V> {
  type: T;
  value: V;
}


export type ActionType = (
  | IAction<'HEART_BEAT', boolean>
  | IAction<'LOGIN_BEGIN', null>
  | IAction<'LOGIN_END', EmployeeResponse>
  | IAction<'LOGOUT', null>
  | IAction<'ERROR', Error>
);
