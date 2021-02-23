import React from 'react';
import { hot } from 'react-hot-loader/root';

import { Server } from '@/lib';
import { GlobalProvider } from '@/hooks/global';
import { EmployeeProvider } from '@/hooks/employee';
import { ReviewProvider } from '@/hooks/review';
import { SessionProvider } from '@/hooks/session';
import { FeedbackProvider } from '@/hooks/feedback';

const ThemeProvider = React.lazy(() => import('./lazy/theme_provider'));
const Application = React.lazy(() => import('./lazy/application'));


interface IProps {
  server: Server;
}
function ShellApplication (props: IProps) {
  return (
    <GlobalProvider server={props.server}>
      <React.Suspense fallback={<LoadingBlock />}>
        <ThemeProvider>
          <SessionProvider>
            <FeedbackProvider>
              <EmployeeProvider>
                <ReviewProvider>
                  <Application />
                </ReviewProvider>
              </EmployeeProvider>
            </FeedbackProvider>
          </SessionProvider>
        </ThemeProvider>
      </React.Suspense>
    </GlobalProvider>
  );
}


function LoadingBlock (props: {}) {
  return (
    <h1>Loading...</h1>
  );
}


export const HotApplication = hot(React.memo(ShellApplication));
