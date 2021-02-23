import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { useInstance, ReviewEmployeeResponse } from '@/lib';
import { useGlobal } from '@/hooks/global';


const useStyles = makeStyles(() => ({
  reviewInvite: {},
  userList: {
    minWidth: '400px',
    maxHeight: '300px',
    overflowY: 'scroll',
  },
}));


interface IProps {
  onClose: () => void;
  reviewID: number;
}
export function ReviewInviteDialog (props: IProps) {
  const { server } = useGlobal();
  const classes = useStyles();

  const [employeeList, setEmployeeList] = React.useState<ReviewEmployeeResponse[]>([]);
  const [selected, setSelected] = React.useState<Record<number, boolean>>({});

  const self = useInstance(() => ({
    async inviteReview () {
      const idList = [];
      for (const [id, s] of Object.entries(selected)) {
        if (s) {
          idList.push(parseInt(id, 10));
        }
      }
      await server.inviteReview(props.reviewID, idList);

      const list = await server.listReviewEmployees(props.reviewID);
      const s: Record<number, boolean> = {};
      for (const e of list) {
        s[e.id] = e.requested;
      }
      setEmployeeList(list);
      setSelected(s);

      props.onClose();
    },
  }), [employeeList, selected, props.reviewID, props.onClose, setEmployeeList, setSelected]);

  const onInvite = React.useCallback(async () => {
    await self.current.inviteReview();
  }, [self]);

  React.useEffect(() => {
    if (props.reviewID === 0) {
      return;
    }
    server.listReviewEmployees(props.reviewID).then((list) => {
      const s: Record<number, boolean> = {};
      for (const e of list) {
        s[e.id] = e.requested;
      }
      setEmployeeList(list);
      setSelected(s);
    });
  }, [props.reviewID, setEmployeeList]);

  return (
    <Dialog
      id="review-invite-dialog"
      aria-labelledby="review-invite-title"
      className={classes.reviewInvite}
      open={props.reviewID !== 0}
      onClose={props.onClose}
    >
      <DialogTitle id="review-invite-title">Invite Employees</DialogTitle>
      <DialogContent>
        <div className={classes.userList}>
          <List>
            {employeeList.map((employee) => (
              <ListItem key={employee.id}>
                <ListItemIcon>
                  <Checkbox
                    disabled={employee.requested}
                    checked={selected[employee.id]}
                    onChange={(event) => {
                      selected[employee.id] = event.target.checked;
                      setSelected({ ...selected });
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary={employee.username} />
              </ListItem>
            ))}
          </List>
        </div>
        <DialogActions>
          <Button
            onClick={props.onClose}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={onInvite}
            color="primary"
          >
            Invite
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
