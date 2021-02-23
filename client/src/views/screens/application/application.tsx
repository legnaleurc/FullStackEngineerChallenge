import React from 'react';
import { BrowserRouter, Switch, Route, useHistory } from 'react-router-dom';
import { Button, Typography, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';

import { getMixins } from '@/lib';
import { useSessionState, useSessionAction } from '@/hooks/session';
import { EmployeeList, EmployeeDetail } from '@/views/screens/employee';
import { ReviewList } from '@/views/screens/review';
import { Home } from '@/views/screens/home';
import { FeedbackList } from '@/views/screens/feedback';

const LoginView = React.lazy(() => import('./lazy/login_view'));


const useStyles = makeStyles((theme) => ({
  application: {
    ...getMixins([
      'vbox',
      'w-100',
      'h-100',
    ]),
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.default,
  },
  header: {
    ...getMixins([
      'hbox',
    ]),
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem',
  },
}));
type IClasses = ReturnType<typeof useStyles>;


export function Application (props: {}) {
  const classes = useStyles();
  return (
    <div className={classes.application}>
      <BrowserRouter>
        <Switch>
          <Route exact={true} path="/" component={Home} />
          <Route exact={true} path="/login" component={LoginView} />
          <Route component={() => (<Frame classes={classes} />)} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}


interface IFrame {
  classes: IClasses;
}
function Frame (props: IFrame) {
  return (
    <>
      <Header classes={props.classes} />
      <Switch>
        <Route exact={true} path="/employees" component={EmployeeList} />
        <Route exact={true} path="/employees/:employeeId" component={EmployeeDetail} />
        <Route exact={true} path="/employees/:employeeId/reviews" component={ReviewList} />
        <Route exact={true} path="/feedbacks" component={FeedbackList} />
      </Switch>
    </>
  );
}


interface IHeader {
  classes: IClasses;
}
function Header (props: IHeader) {
  const history = useHistory();
  const { logout } = useSessionAction();
  const { user } = useSessionState();
  const { classes } = props;

  const handleBack = React.useCallback(() => {
    history.goBack();
  }, [history]);

  const handleLogout = React.useCallback(() => {
    logout();
    history.push('/login');
  }, [logout, history]);

  return (
    <div className={classes.header}>
      <IconButton onClick={handleBack}>
        <ArrowBackIcon />
      </IconButton>
      <Typography>Logged in as {user.username}</Typography>
      <Button color="secondary" onClick={handleLogout}>Logout</Button>
    </div>
  );
}
