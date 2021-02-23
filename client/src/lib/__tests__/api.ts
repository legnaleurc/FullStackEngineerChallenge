import { enableFetchMocks } from 'jest-fetch-mock';

import {
  Server,
} from '@/lib/api';


enableFetchMocks();


describe('api', () => {

  describe('Server', () => {

    beforeEach(() => {
      fetchMock.resetMocks();
    });

    it('login', async () => {
      const expected = {
        token: 'token',
        user: {
          id: 1,
        },
      };
      fetchMock.mockOnce(async () => {
        return makeJsonResponse(expected);
      });

      const server = new Server();
      const rv = await server.login('admin', '1234');

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const request = fetchMock.mock.calls[0][0] as Request;
      expect(request.method).toEqual('POST');
      expect(request.url).toEqual('http://localhost/api/v1/tokens/');
      expect(rv).toEqual(expected.user);
    });

    it('fetchSelf', async () => {
      const server = await getSession();
      const expected = {
        id: 1,
      };
      fetchMock.mockOnce(async () => {
        return makeJsonResponse(expected);
      });
      const rv = await server.fetchSelf();

      const request = fetchMock.mock.calls[1][0] as Request;
      expect(request.method).toEqual('GET');
      expect(request.url).toEqual('http://localhost/api/v1/employees/:self');
      expect(rv).toEqual(expected);
    });

    it('listEmployees', async () => {
      const server = await getSession();
      const expected = [
        {
          id: 1,
        },
      ];
      fetchMock.mockOnce(async () => {
        return makeJsonResponse(expected);
      });
      const rv = await server.listEmployees();

      const request = fetchMock.mock.calls[1][0] as Request;
      expect(request.method).toEqual('GET');
      expect(request.url).toEqual('http://localhost/api/v1/employees/');
      expect(rv).toEqual(expected);
    });

    it('updateEmployee', async () => {
      const server = await getSession();
      const expected = {
        id: 1,
      };
      fetchMock.mockOnce(async () => {
        return makeJsonResponse(expected);
      });
      const rv = await server.updateEmployee(1, 'aa@bb.cc');

      const request = fetchMock.mock.calls[1][0] as Request;
      expect(request.method).toEqual('PUT');
      expect(request.url).toEqual('http://localhost/api/v1/employees/1/');
      expect(rv).toEqual(expected);
    });

    it('deleteEmployee', async () => {
      const server = await getSession();
      fetchMock.mockOnce(async () => {
        return makeJsonResponse('', 204);
      });
      const rv = await server.deleteEmployee(1);

      const request = fetchMock.mock.calls[1][0] as Request;
      expect(request.method).toEqual('DELETE');
      expect(request.url).toEqual('http://localhost/api/v1/employees/1/');
    });

    it('createEmployee', async () => {
      const server = await getSession();
      const expected = {
        id: 1,
      };
      fetchMock.mockOnce(async () => {
        return makeJsonResponse(expected, 201);
      });
      const rv = await server.createEmployee('user1', '1234');

      const request = fetchMock.mock.calls[1][0] as Request;
      expect(request.method).toEqual('POST');
      expect(request.url).toEqual('http://localhost/api/v1/employees/');
      expect(rv).toEqual(expected);
    });

  });

});


async function getSession () {
  fetchMock.mockOnce(async () => {
    return makeJsonResponse({
      token: 'token',
      user: {
        id: 1,
      },
    });
  });
  const server = new Server();
  await server.login('admin', '1234');
  return server;
}


function makeJsonResponse (expected: any, status: number = 200) {
  return {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expected),
    status,
  };
}


function makeJsonErrorResponse (status: number, expected: any) {
  return {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expected),
  };
}
