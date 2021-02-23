import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { useFeedbackState, useFeedbackAction } from '@/hooks/feedback';


const useStyles = makeStyles(() => ({
  feedbackDialog: {},
}));


interface IProps {
  onClose: () => void;
  feedbackID: number;
}
export function FeedbackDialog (props: IProps) {
  const { updateFeedback } = useFeedbackAction();
  const { feedbackDict } = useFeedbackState();
  const classes = useStyles();

  const feedback = feedbackDict[props.feedbackID];

  const [score, setScore] = React.useState(0);
  const [memo, setMemo] = React.useState('');

  const handleScore = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const s = parseInt(event.target.value, 10);
    if (s >= 0 && s <= 100) {
      setScore(s);
    }
  }, [setScore]);

  const handleMemo = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setMemo(event.target.value);
  }, [setMemo]);

  const onSubmit = React.useCallback(async () => {
    await updateFeedback(props.feedbackID, score, memo);
  }, [props.feedbackID, score, memo]);

  React.useEffect(() => {
    if (!feedback || !feedback.reviewresponse) {
      return;
    }
    setScore(feedback.reviewresponse.score);
    setMemo(feedback.reviewresponse.memo);
  }, [feedback, setScore, setMemo]);

  if (!feedback) {
    return <div />;
  }

  return (
    <Dialog
      id="feedback-dialog"
      aria-labelledby="feedback-title"
      className={classes.feedbackDialog}
      open={props.feedbackID !== 0}
      onClose={props.onClose}
    >
      <DialogTitle id="feedback-title">Write Feedback</DialogTitle>
      <DialogContent>
        <div>
          <TextField
            id="score"
            type="number"
            label="Score"
            inputProps={{
              max: 100,
              min: 0,
            }}
            disabled={!!feedback.reviewresponse}
            value={score}
            onChange={handleScore}
          />
          <TextField
            id="memo"
            label="Memo"
            multiline={true}
            disabled={!!feedback.reviewresponse}
            value={memo}
            onChange={handleMemo}
          />
        </div>
        <DialogActions>
          <Button
            onClick={props.onClose}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!!feedback.reviewresponse}
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
