import React from 'react';
import ReactDOM from 'react-dom';

import { Server } from '@/lib';
import { Application } from '@/views/screens/application';

import './index.css';


const gServer = new Server();

ReactDOM.render(
  (
    <Application server={gServer} />
  ),
  document.querySelector('body > .body'),
);
