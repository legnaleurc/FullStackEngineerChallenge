import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  RateReview as RateReviewIcon,
} from '@material-ui/icons';

import { getMixins } from '@/lib';
import { useEmployeeAction, useEmployeeState } from '@/hooks/employee';
import { EmployeeCreate } from './employee_create';


const useStyles = makeStyles(() => ({
  employeeList: {
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


export function EmployeeList (props: {}) {
  const history = useHistory();
  const { fetchEmployeeList, deleteEmployee } = useEmployeeAction();
  const { idList, employeeDict } = useEmployeeState();

  const classes = useStyles();

  React.useEffect(() => {
    fetchEmployeeList();
  }, []);

  return (
    <div className={classes.employeeList}>
      <EmployeeCreate />
      <List className={classes.list}>
        {idList.map((id) => (
          <ListItem key={id}>
            <ListItemText
              primary={employeeDict[id].username}
            />
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => {
                  history.push(`/employees/${id}/reviews`);
                }}
              >
                <RateReviewIcon />
              </IconButton>
              <IconButton
                onClick={() => {
                  history.push(`/employees/${id}`);
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="secondary"
                onClick={() => {
                  deleteEmployee(id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
