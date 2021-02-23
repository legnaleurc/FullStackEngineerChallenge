import React from 'react';
import { Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { getMixins } from '@/lib';
import { useEmployeeAction } from '@/hooks/employee';


const useStyles = makeStyles(() => ({
  employeeCreate: {
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


export function EmployeeCreate (props: {}) {
  const { createEmployee } = useEmployeeAction();
  const classes = useStyles();

  const [username, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleUserName = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  }, [setUserName]);

  const handlePassword = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }, [setPassword]);

  const handleCreate = React.useCallback(async () => {
    await createEmployee(username, password);
    setUserName('');
    setPassword('');
  }, [username, password, createEmployee]);

  return (
    <div className={classes.employeeCreate}>
      <TextField id="username" label="User Name" className={classes.inputField} value={username} onChange={handleUserName} />
      <TextField id="password" label="Password" className={classes.inputField} value={password} onChange={handlePassword} />
      <Button disabled={!username || !password} className={classes.button} onClick={handleCreate}>Create</Button>
    </div>
  );
}
