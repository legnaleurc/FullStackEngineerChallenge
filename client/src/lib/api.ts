export class Server {
  private _baseURL: string;
  private _token: string;

  constructor () {
    const { protocol, host } = window.location;
    this._baseURL = `${protocol}//${host}`;
    this._token = window.localStorage.getItem('token') || '';
  }

  get isAuthenticated () {
    if (!this._token) {
      return false;
    }
    return true;
  }

  async login (username: string, password: string) {
    const r = await this._post('/api/v1/tokens/', {
      username,
      password,
    });
    if (r.status !== 200) {
      throw new Error(r.statusText);
    }
    const data: TokenResponse = await r.json();
    this._token = data.token;
    window.localStorage.setItem('token', this._token);
    return data.user;
  }

  logout () {
    this._token = '';
    window.localStorage.removeItem('token');
  }

  async fetchSelf () {
    const r = await this._get('/api/v1/employees/:self');
    if (r.status !== 200) {
      throw new Error(r.statusText);
    }
    const rv: EmployeeResponse = await r.json();
    return rv;
  }

  async listEmployees () {
    const r = await this._get('/api/v1/employees/');
    if (r.status !== 200) {
      throw new Error(r.statusText);
    }
    const rv: EmployeeResponse[] = await r.json();
    return rv;
  }

  async updateEmployee (id: number, email: string) {
    const r = await this._put(`/api/v1/employees/${id}/`, {
      email,
    });
    if (r.status !== 200) {
      throw new Error(r.statusText);
    }
    const rv: EmployeeResponse = await r.json();
    return rv;
  }

  async deleteEmployee (id: number) {
    const r = await this._delete(`/api/v1/employees/${id}/`);
    if (r.status !== 204) {
      throw new Error(r.statusText);
    }
  }

  async createEmployee (username: string, password: string) {
    const r = await this._post('/api/v1/employees/', {
      username,
      password,
    });
    if (r.status !== 201) {
      throw new Error(r.statusText);
    }
    const rv: EmployeeResponse = await r.json();
    return rv;
  }

  async listReviews (userID: number) {
    const r = await this._get('/api/v1/reviews/', {
      user: userID,
    });
    if (r.status !== 200) {
      throw new Error(r.statusText);
    }
    const rv: ReviewResponse[] = await r.json();
    return rv;
  }

  async createReview (userID: number, title: string) {
    const r = await this._post(`/api/v1/reviews/`, {
      owner: userID,
      title,
    });
    if (r.status !== 201) {
      throw new Error(r.statusText);
    }
    const rv: ReviewResponse = await r.json();
    return rv;
  }

  async updateReview (id: number, title: string) {
    const r = await this._put(`/api/v1/reviews/${id}/`, {
      title,
    });
    if (r.status !== 200) {
      throw new Error(r.statusText);
    }
    const rv: ReviewResponse = await r.json();
    return rv;
  }

  async listReviewEmployees (reviewID: number) {
    const r = await this._get(`/api/v1/reviews/${reviewID}/:employees`);
    if (r.status !== 200) {
      throw new Error(r.statusText);
    }
    const rv: ReviewEmployeeResponse[] = await r.json();
    return rv;
  }

  async inviteReview (reviewID: number, userIDList: number[]) {
    const r = await this._post(`/api/v1/reviews/${reviewID}/:invite`, {
      participants: userIDList,
    });
    if (r.status !== 201) {
      throw new Error(r.statusText);
    }
  }

  async listFeedbacks () {
    const r = await this._get(`/api/v1/feedbacks/`);
    if (r.status !== 200) {
      throw new Error(r.statusText);
    }
    const rv: FeedbackResponse[] = await r.json();
    return rv;
  }

  async updateFeedback (feedbackID: number, score: number, memo: string) {
    const r = await this._patch(`/api/v1/feedbacks/${feedbackID}/`, {
      score,
      memo,
    });
    if (r.status !== 200) {
      throw new Error(r.statusText);
    }
    const rv: FeedbackResponse = await r.json();
    return rv;
  }

  private async _get (path: string, params?: Record<string, any>) {
    return await this._ajax('GET', path, params);
  }

  private async _post (path: string, params?: Record<string, any>) {
    return await this._ajax('POST', path, params);
  }

  private async _put (path: string, params?: Record<string, any>) {
    return await this._ajax('PUT', path, params);
  }

  private async _patch (path: string, params?: Record<string, any>) {
    return await this._ajax('PATCH', path, params);
  }

  private async _delete (path: string, params?: Record<string, any>) {
    return await this._ajax('DELETE', path, params);
  }

  private async _ajax (method: string, path: string, params?: Record<string, any>) {
    const url = new URL(`${this._baseURL}${path}`);
    let body = null;
    if (params) {
      if (method === 'GET') {
        Object.keys(params).forEach(k => {
          url.searchParams.append(k, params[k].toString());
        });
      } else {
        body = JSON.stringify(params);
      }
    }
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    if (this.isAuthenticated) {
      headers['Authorization'] = `Token ${this._token}`;
    }
    const rqst = new Request(url.toString(), {
      method,
      headers,
      cache: 'no-cache',
      body,
      mode: 'cors',
    });
    return await fetch(rqst);
  }
}


interface TokenResponse {
  token: string;
  user: EmployeeResponse;
}


export interface EmployeeResponse {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
}


export interface ReviewEmployeeResponse extends EmployeeResponse {
  requested: boolean;
}


export interface SimpleReviewResponse {
  id: number;
  owner: EmployeeResponse;
  title: string;
}


export interface ReviewResponse {
  id: number;
  owner: number;
  title: string;
  score: number;
  requested: number;
  responsed: number;
}


export interface FeedbackContentResponse {
  score: number;
  memo: string;
}


export interface FeedbackResponse {
  id: number;
  owner: EmployeeResponse;
  review: SimpleReviewResponse;
  reviewresponse: null | FeedbackContentResponse;
}
