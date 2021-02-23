import React from 'react';

import { useInstance } from '@/lib';
import { useGlobal } from '@/hooks/global';
import { ActionType, IReview } from './types';


interface IStateContext {
  isFetching: boolean;
  idList: number[];
  reviewDict: Record<number, IReview>;
}
const StateContext = React.createContext<IStateContext | null>(null);
interface IActionContext {
  fetchReviewList: (userID: number) => Promise<void>;
  updateReview: (id: number, title: string) => Promise<void>;
  createReview: (userID: number, title: string) => Promise<void>;
}
const ActionContext = React.createContext<IActionContext | null>(null);


export const ReviewProvider: React.FC<{}> = (props) => {
  const {
    state,
    fetchReviewList,
    updateReview,
    createReview,
  } = useActions();

  return (
    <ActionContext.Provider
      value={{
        fetchReviewList,
        updateReview,
        createReview,
      }}
    >
      <StateContext.Provider value={state}>
        {props.children}
      </StateContext.Provider>
    </ActionContext.Provider>
  );
};


export function useReviewAction () {
  const context = React.useContext(ActionContext);
  if (!context) {
    throw new Error('review context is not ready');
  }
  return context;
}


export function useReviewState () {
  const context = React.useContext(StateContext);
  if (!context) {
    throw new Error('review context is not ready');
  }
  return context;
}


function useActions () {
  const { server } = useGlobal();

  const [state, dispatch] = React.useReducer(reduce, {
    isFetching: false,
    idList: [],
    reviewDict: {},
  });

  const self = useInstance(() => ({
    get isFetching () {
      return state.isFetching;
    },
  }), [state.isFetching]);

  const fetchReviewList = React.useCallback(async (userID: number) => {
    if (self.current.isFetching) {
      return;
    }

    dispatch({
      type: 'FETCH_LIST_BEGIN',
      value: null,
    });

    try {
      const reviewList = await server.listReviews(userID);
      dispatch({
        type: 'FETCH_LIST_END',
        value: reviewList,
      });
    } catch (e) {
      dispatch({
        type: 'ERROR',
        value: e,
      });
    }
  }, [dispatch, self, server]);

  const updateReview = React.useCallback(async (id: number, title: string) => {
    if (self.current.isFetching) {
      return;
    }

    dispatch({
      type: 'UPDATE_BEGIN',
      value: id,
    });

    try {
      const review = await server.updateReview(id, title);
      dispatch({
        type: 'UPDATE_END',
        value: review,
      });
    } catch (e) {
      dispatch({
        type: 'ERROR',
        value: e,
      });
    }
  }, [dispatch, self, server]);

  const createReview = React.useCallback(async (userID: number, title: string) => {
    if (self.current.isFetching) {
      return;
    }

    dispatch({
      type: 'CREATE_BEGIN',
      value: null,
    });

    try {
      const review = await server.createReview(userID, title);
      dispatch({
        type: 'CREATE_END',
        value: review,
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
    fetchReviewList,
    updateReview,
    createReview,
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
      const reviewList = action.value;
      const reviewDict: Record<number, IReview> = {};
      for (const review of reviewList) {
        reviewDict[review.id] = review;
      }
      return {
        ...state,
        isFetching: false,
        idList: reviewList.map((review) => (review.id)),
        reviewDict,
      };
    }
    case 'UPDATE_BEGIN': {
      return {
        ...state,
        isFetching: true,
      };
    }
    case 'UPDATE_END': {
      const review = action.value;
      const { reviewDict } = state;
      reviewDict[review.id] = review;
      return {
        ...state,
        isFetching: false,
        reviewDict: { ...reviewDict },
      };
    }
    case 'CREATE_BEGIN': {
      return {
        ...state,
        isFetching: true,
      };
    }
    case 'CREATE_END': {
      const review = action.value;
      const { idList, reviewDict } = state;
      reviewDict[review.id] = review;
      return {
        ...state,
        isFetching: false,
        idList: [...idList, review.id],
        reviewDict: { ...reviewDict },
      };
    }
    default:
      return state;
  }
}
