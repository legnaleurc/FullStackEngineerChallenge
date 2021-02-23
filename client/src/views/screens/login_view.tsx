import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { getMixins } from '@/lib';
import { useSessionAction, useSessionState } from '@/hooks/session';


const useStyles = makeStyles(() => ({
  loginView: {
    ...getMixins([
      'hbox',
      'w-100',
      'h-100',
      'center',
    ]),
  },
  form: {
    ...getMixins([
      'vbox',
    ]),
  },
}));


export function LoginView (props: {}) {
  const history = useHistory();
  const { login } = useSessionAction();
  const { user, isAuthenticated } = useSessionState();

  const classes = useStyles();
  const [username, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleUserName = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  }, [setUserName]);

  const handlePassword = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }, [setPassword]);

  const handleLogin = React.useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await login(username, password);
    if (!isAuthenticated) {
      return;
    }
    if (user.is_admin) {
      history.push('/employees');
    } else {
      history.push('/feedbacks');
    }
  }, [username, password, login, user, isAuthenticated]);

  return (
    <div className={classes.loginView}>
      <form
        className={classes.form}
        noValidate={true}
        autoComplete="off"
        onSubmit={handleLogin}
      >
        <TextField
          id="username"
          label="User Name"
          value={username}
          onChange={handleUserName}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={handlePassword}
        />
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
}
