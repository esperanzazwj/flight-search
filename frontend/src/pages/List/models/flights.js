import { queryFlights, queryWish, addWish, removeWish, queryFakeList } from '@/services/api';

export default {
  namespace: 'flights',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      console.log("payload----", payload);
      const response = yield call(queryFlights, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addWish, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
        console.log("payload-save-----", action.payload);
      return {
        ...state,
        data: action.payload,
      };
    },
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
