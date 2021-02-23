import React from 'react';

import { useInstance } from '@/lib';
import { useGlobal } from '@/hooks/global';
import { ActionType, IFeedback } from './types';


interface IStateContext {
  isFetching: boolean;
  idList: number[];
  feedbackDict: Record<number, IFeedback>;
}
const StateContext = React.createContext<IStateContext | null>(null);
interface IActionContext {
  fetchFeedbackList: () => Promise<void>;
  updateFeedback: (feedbackID: number, score: number, memo: string) => Promise<void>;
}
const ActionContext = React.createContext<IActionContext | null>(null);


export const FeedbackProvider: React.FC<{}> = (props) => {
  const {
    state,
    fetchFeedbackList,
    updateFeedback,
  } = useActions();

  return (
    <ActionContext.Provider
      value={{
        fetchFeedbackList,
        updateFeedback,
      }}
    >
      <StateContext.Provider value={state}>
        {props.children}
      </StateContext.Provider>
    </ActionContext.Provider>
  );
};


export function useFeedbackAction () {
  const context = React.useContext(ActionContext);
  if (!context) {
    throw new Error('feedback context is not ready');
  }
  return context;
}


export function useFeedbackState () {
  const context = React.useContext(StateContext);
  if (!context) {
    throw new Error('feedback context is not ready');
  }
  return context;
}


function useActions () {
  const { server } = useGlobal();

  const [state, dispatch] = React.useReducer(reduce, {
    isFetching: false,
    idList: [],
    feedbackDict: {},
  });

  const self = useInstance(() => ({
    get isFetching () {
      return state.isFetching;
    },
  }), [state.isFetching]);

  const fetchFeedbackList = React.useCallback(async () => {
    if (self.current.isFetching) {
      return;
    }

    dispatch({
      type: 'FETCH_LIST_BEGIN',
      value: null,
    });

    try {
      const feedbackList = await server.listFeedbacks();
      dispatch({
        type: 'FETCH_LIST_END',
        value: feedbackList,
      });
    } catch (e) {
      dispatch({
        type: 'ERROR',
        value: e,
      });
    }
  }, [dispatch, self, server]);

  const updateFeedback = React.useCallback(async (feedbackID: number, score: number, memo: string) => {
    if (self.current.isFetching) {
      return;
    }

    dispatch({
      type: 'UPDATE_BEGIN',
      value: null,
    });

    try {
      const feedback = await server.updateFeedback(feedbackID, score, memo);
      dispatch({
        type: 'UPDATE_END',
        value: feedback,
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
    fetchFeedbackList,
    updateFeedback,
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
      const feedbackList = action.value;
      const feedbackDict: Record<number, IFeedback> = {};
      for (const feedback of feedbackList) {
        feedbackDict[feedback.id] = feedback;
      }
      return {
        ...state,
        isFetching: false,
        idList: feedbackList.map((feedback) => (feedback.id)),
        feedbackDict,
      };
    }
    case 'UPDATE_BEGIN': {
      return {
        ...state,
        isFetching: true,
      };
    }
    case 'UPDATE_END': {
      const feedback = action.value;
      const { feedbackDict } = state;
      feedbackDict[feedback.id] = feedback;
      return {
        ...state,
        isFetching: false,
        feedbackDict: { ...feedbackDict },
      };
    }
    default:
      return state;
  }
}
