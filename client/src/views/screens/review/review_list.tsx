import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Add as AddIcon } from '@material-ui/icons';

import { getMixins } from '@/lib';
import { useReviewAction, useReviewState } from '@/hooks/review';
import { ReviewCreate } from './review_create';
import { ReviewInviteDialog } from './review_invite';


interface RouteParams {
  employeeId: string;
}


const useStyles = makeStyles(() => ({
  reviewList: {
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


export function ReviewList (props: {}) {
  const history = useHistory();
  const { employeeId } = useParams<RouteParams>();
  const { fetchReviewList } = useReviewAction();
  const { idList, reviewDict } = useReviewState();

  const classes = useStyles();
  const [reviewID, setReviewID] = React.useState(0);

  const closeModal = React.useCallback(() => {
    setReviewID(0);
  }, [setReviewID]);

  React.useEffect(() => {
    const id = parseInt(employeeId, 10);
    fetchReviewList(id);
  }, [fetchReviewList, employeeId]);

  return (
    <div className={classes.reviewList}>
      <ReviewCreate employeeID={parseInt(employeeId, 10)} />
      <List className={classes.list}>
        {idList.map((id) => (
          <ListItem key={id}>
            <ListItemText
              primary={`${reviewDict[id].title} (score: ${reviewDict[id].score}, requested: ${reviewDict[id].requested}, responsed: ${reviewDict[id].responsed})`}
            />
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => {
                  setReviewID(id);
                }}
              >
                <AddIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <ReviewInviteDialog reviewID={reviewID} onClose={closeModal} />
    </div>
  );
}
