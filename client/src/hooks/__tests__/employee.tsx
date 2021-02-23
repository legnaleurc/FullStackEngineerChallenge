import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Server } from '@/lib';
import { GlobalProvider } from '@/hooks/global';
import {
  EmployeeProvider,
  useEmployeeAction,
  useEmployeeState,
} from '@/hooks/employee';
import { makeEventHandler } from '@/lib/mocks';


describe('employee', () => {

  describe('<EmployeeProvider />', () => {

    interface IRoot {
      server: Server;
      actionStub: () => void;
    }
    function Root (props: IRoot) {
      return (
        <GlobalProvider server={props.server}>
          <EmployeeProvider>
            <Action stub={props.actionStub} />
            <State />
          </EmployeeProvider>
        </GlobalProvider>
      );
    }

    function Action (props: { stub: () => void }) {
      const {
        fetchEmployeeList,
        updateEmployee,
        createEmployee,
        deleteEmployee,
      } = useEmployeeAction();

      React.useEffect(() => {
        props.stub();
      }, [
        props.stub,
        fetchEmployeeList,
        createEmployee,
        updateEmployee,
        deleteEmployee,
      ]);

      const onList = makeEventHandler((event) => {
        fetchEmployeeList();
      }, [fetchEmployeeList]);
      const onCreate = makeEventHandler((event) => {
        const data = event.currentTarget.dataset;
        const username = data.username!;
        const password = data.password!;
        createEmployee(username, password);
      }, [createEmployee]);
      const onUpdate = makeEventHandler((event) => {
        const data = event.currentTarget.dataset;
        const id = parseInt(data.id!, 10);
        const email = data.email!;
        updateEmployee(id, email);
      }, [updateEmployee]);
      const onDelete = makeEventHandler((event) => {
        const data = event.currentTarget.dataset;
        const id = parseInt(data.id!, 10);
        deleteEmployee(id);
      }, [deleteEmployee]);

      return (
        <>
          <button aria-label="list" onClick={onList} />
          <button aria-label="create" onClick={onCreate} />
          <button aria-label="update" onClick={onUpdate} />
          <button aria-label="delete" onClick={onDelete} />
        </>
      );
    }

    function State (props: {}) {
      const { idList, isFetching } = useEmployeeState();
      const [current, setCurrent] = React.useState(0);

      const onClick = makeEventHandler((event) => {
        const data = event.currentTarget.dataset;
        const current = parseInt(data.current!, 10);
        setCurrent(current);
      }, [setCurrent]);

      return (
        <>
          <ul>
            {idList.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
          <input type="checkbox" readOnly={true} checked={isFetching} />
          <button aria-label="setCurrent" onClick={onClick} />
          <MaybeEmployee id={current} />
        </>
      );
    }

    interface IMaybeEmployee {
      id: number;
    }
    function MaybeEmployee (props: IMaybeEmployee) {
      const { employeeDict } = useEmployeeState();
      if (!props.id) {
        return null;
      }
      const { email } = employeeDict[props.id];
      return (
        <>
          <input type="text" readOnly={true} value={email} />
        </>
      );
    }


    function list () {
      const btn = screen.getByRole('button', { name: 'list' });
      userEvent.click(btn);
    }


    function create (username: string, password: string) {
      const btn = screen.getByRole('button', { name: 'create' });
      btn.dataset.username = username;
      btn.dataset.password = password;
      userEvent.click(btn);
    }


    function update (id: number, email: string) {
      const btn = screen.getByRole('button', { name: 'update' });
      btn.dataset.id = `${id}`;
      btn.dataset.email = email;
      userEvent.click(btn);
    }


    function delete_ (id: number) {
      const btn = screen.getByRole('button', { name: 'delete' });
      btn.dataset.id = `${id}`;
      userEvent.click(btn);
    }


    function setId (id: number) {
      const btn = screen.getByRole('button', { name: 'setCurrent' });
      btn.dataset.current = `${id}`;
      userEvent.click(btn);
    }

    function idList () {
      return screen.queryAllByRole('listitem');
    }

    function isFetching () {
      return screen.getByRole('checkbox');
    }

    function email () {
      return screen.getByRole('textbox');
    }

    function newServer (mock: Record<string, any>) {
      return mock as unknown as Server;
    }


    it('has good initial data', () => {
      const actionStub = jest.fn();
      const server = newServer({});
      render(<Root server={server} actionStub={actionStub} />);

      expect(idList()).toHaveLength(0);
      expect(actionStub).toHaveBeenCalledTimes(1);
    });

    it('can list employees', async () => {
      const actionStub = jest.fn();
      const server = newServer({
        listEmployees: jest.fn().mockResolvedValue([
          {
            id: 1,
            email: 'aa@aa.aa',
          },
          {
            id: 2,
            email: 'bb@bb.bb',
          },
        ]),
      });
      render(<Root server={server} actionStub={actionStub} />);

      list();

      expect(isFetching()).toBeChecked();
      await waitFor(() => {
        expect(isFetching()).not.toBeChecked();
      });

      expect(idList()).toHaveLength(2);

      setId(1);
      expect(email()).toHaveValue('aa@aa.aa');

      expect(actionStub).toHaveBeenCalledTimes(1);
    });

    it('can create employee', async () => {
      const actionStub = jest.fn();
      const server = newServer({
        createEmployee: jest.fn().mockResolvedValue({
          id: 1,
          email: 'aa@aa.aa',
        }),
      });
      render(<Root server={server} actionStub={actionStub} />);

      create('user1', '1234');

      expect(isFetching()).toBeChecked();
      await waitFor(() => {
        expect(isFetching()).not.toBeChecked();
      });

      expect(idList()).toHaveLength(1);

      setId(1);
      expect(email()).toHaveValue('aa@aa.aa');

      expect(actionStub).toHaveBeenCalledTimes(1);
    });

    it('can update employee', async () => {
      const actionStub = jest.fn();
      const server = newServer({
        listEmployees: jest.fn().mockResolvedValue([
          {
            id: 1,
            email: 'aa@aa.aa',
          },
        ]),
        updateEmployee: jest.fn().mockResolvedValue({
          id: 1,
          email: 'bb@bb.bb',
        }),
      });
      render(<Root server={server} actionStub={actionStub} />);

      list();

      expect(isFetching()).toBeChecked();
      await waitFor(() => {
        expect(isFetching()).not.toBeChecked();
      });

      update(1, 'bb@bb.bb');

      expect(isFetching()).toBeChecked();
      await waitFor(() => {
        expect(isFetching()).not.toBeChecked();
      });

      expect(idList()).toHaveLength(1);

      setId(1);
      expect(email()).toHaveValue('bb@bb.bb');

      expect(actionStub).toHaveBeenCalledTimes(1);
    });

    it('can delete employee', async () => {
      const actionStub = jest.fn();
      const server = newServer({
        listEmployees: jest.fn().mockResolvedValue([
          {
            id: 1,
            email: 'aa@aa.aa',
          },
        ]),
        deleteEmployee: jest.fn().mockResolvedValue(null),
      });
      render(<Root server={server} actionStub={actionStub} />);

      list();

      expect(isFetching()).toBeChecked();
      await waitFor(() => {
        expect(isFetching()).not.toBeChecked();
      });

      expect(idList()).toHaveLength(1);

      delete_(1);

      expect(isFetching()).toBeChecked();
      await waitFor(() => {
        expect(isFetching()).not.toBeChecked();
      });

      expect(idList()).toHaveLength(0);

      expect(actionStub).toHaveBeenCalledTimes(1);
    });

  });

});
