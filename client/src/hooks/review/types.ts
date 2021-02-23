import { ReviewResponse } from '@/lib';


export interface IReview {
  id: number;
  owner: number;
  title: string;
  score: number;
  requested: number;
  responsed: number;
}


interface IAction<T, V> {
  type: T;
  value: V;
}


export type ActionType = (
  | IAction<'FETCH_LIST_BEGIN', null>
  | IAction<'FETCH_LIST_END', ReviewResponse[]>
  | IAction<'UPDATE_BEGIN', number>
  | IAction<'UPDATE_END', ReviewResponse>
  | IAction<'DELETE_BEGIN', null>
  | IAction<'DELETE_END', number>
  | IAction<'CREATE_BEGIN', null>
  | IAction<'CREATE_END', ReviewResponse>
  | IAction<'ERROR', Error>
);
