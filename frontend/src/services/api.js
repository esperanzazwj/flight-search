import { stringify } from 'qs';
import request from '@/utils/request';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import * as u from '@/utils/utils';

export const graphqlClient = new ApolloClient({
  uri: `//${window.location.hostname}:4200/`,
});

export async function queryFlights(params) {
  console.log("params----", params);
  return request(`http://127.0.0.1:5000/api/flights?${stringify(params)}`);
}

export async function queryWish(params) {
  return request(`http://127.0.0.1:5000/api/wish`);
}

export async function removeWish(params) {
  return request(`/api/delete?${stringify(params)}`);
}

export async function addWish(params) {
  return request(`http://127.0.0.1:5000/api/add?${stringify(params)}`);
}
export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  // return request('/api/notices');
  return graphqlClient.query({
    query: gql`{
      notices {
        id
        avatar
        title
        description
        extra
        status
        type
        datetime
        read
      }
    }`,
  }).catch((err) => {
    u.log("Failed: queryNotices graphql", err);
    return {
      data: [],
      loading: false,
      stale: false,
      err,
    };
  });
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
