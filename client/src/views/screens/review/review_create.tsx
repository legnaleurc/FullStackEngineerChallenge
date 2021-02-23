import React from 'react';
import { Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { getMixins } from '@/lib';
import { useReviewAction } from '@/hooks/review';


const useStyles = makeStyles(() => ({
  reviewCreate: {
    ...getMixins([
      'hbox',
      'w-100',
    ]),
  },
  inputField: {
    ...getMixins([
      'size-grow',
    ]),
  },
  button: {
    ...getMixins([
      'size-shrink',
    ]),
  },
}));


interface IProps {
  employeeID: number;
}
export function ReviewCreate (props: IProps) {
  const { createReview } = useReviewAction();
  const classes = useStyles();

  const [title, setTitle] = React.useState('');

  const handleTitle = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  }, [setTitle]);

  const handleCreate = React.useCallback(async () => {
    await createReview(props.employeeID, title);
    setTitle('');
  }, [title, createReview, setTitle, props.employeeID]);

  return (
    <div className={classes.reviewCreate}>
      <TextField id="title" label="Title" className={classes.inputField} value={title} onChange={handleTitle} />
      <Button disabled={!title} className={classes.button} onClick={handleCreate}>Create</Button>
    </div>
  );
}
