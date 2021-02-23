import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Edit as EditIcon } from '@material-ui/icons';

import { getMixins } from '@/lib';
import { useFeedbackAction, useFeedbackState } from '@/hooks/feedback';
import { FeedbackDialog } from './feedback_dialog';


const useStyles = makeStyles(() => ({
  feedbackList: {
    ...getMixins([
      'vbox',
      'w-100',
      'h-100',
    ]),
  },
  list: {
    ...getMixins([
      'w-100',
    ]),
  },
}));


export function FeedbackList (props: {}) {
  const { fetchFeedbackList } = useFeedbackAction();
  const { idList, feedbackDict } = useFeedbackState();

  const classes = useStyles();
  const [feedbackID, setFeedbackID] = React.useState(0);

  const closeModal = React.useCallback(() => {
    setFeedbackID(0);
  }, [setFeedbackID]);

  React.useEffect(() => {
    fetchFeedbackList();
  }, [fetchFeedbackList]);

  return (
    <div className={classes.feedbackList}>
      <List className={classes.list}>
        {idList.map((id) => (
          <ListItem key={id}>
            <ListItemText
              primary={`${feedbackDict[id].review.title} (for ${feedbackDict[id].review.owner.username})`}
            />
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => {
                  setFeedbackID(id);
                }}
              >
                <EditIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <FeedbackDialog feedbackID={feedbackID} onClose={closeModal} />
    </div>
  );
}
