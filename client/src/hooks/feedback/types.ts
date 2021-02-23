import { FeedbackResponse, SimpleReviewResponse, EmployeeResponse, FeedbackContentResponse } from '@/lib';


export interface IFeedback {
  id: number;
  owner: EmployeeResponse;
  review: SimpleReviewResponse;
  reviewresponse: FeedbackContentResponse | null;
}


interface IAction<T, V> {
  type: T;
  value: V;
}


export type ActionType = (
  | IAction<'FETCH_LIST_BEGIN', null>
  | IAction<'FETCH_LIST_END', FeedbackResponse[]>
  | IAction<'UPDATE_BEGIN', null>
  | IAction<'UPDATE_END', FeedbackResponse>
  | IAction<'ERROR', Error>
);
