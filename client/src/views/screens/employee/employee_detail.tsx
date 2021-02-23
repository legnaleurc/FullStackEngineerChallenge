import React from 'react';
import { useParams } from 'react-router-dom';
import { Button, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { getMixins } from '@/lib';
import { useEmployeeState, useEmployeeAction } from '@/hooks/employee';


interface RouteParams {
  employeeId: string;
}


const useStyles = makeStyles(() => ({
  employeeDetail: {
    ...getMixins([
      'vbox',
      'w-100',
      'h-100',
    ]),
  },
}));


export function EmployeeDetail (props: {}) {
  const { employeeId } = useParams<RouteParams>();
  const { employeeDict } = useEmployeeState();
  const { updateEmployee } = useEmployeeAction();
  const classes = useStyles();

  const id = parseInt(employeeId, 10);
  const employee = employeeDict[id];

  const [email, setEmail] = React.useState(employee.email);

  const handleEmail = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }, [setEmail]);

  const handleUpdate = React.useCallback(() => {
    updateEmployee(id, email);
  }, [id, email]);

  return (
    <div className={classes.employeeDetail}>
      <Typography>Editing: {employee.username}</Typography>
      <TextField id="email" label="Email" value={email} onChange={handleEmail} />
      <Button onClick={handleUpdate}>Update</Button>
    </div>
  );
}
