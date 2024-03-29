/* eslint-disable import/prefer-default-export */
/* eslint-disable arrow-body-style */
import axios from 'axios';
import constants from '../../constants/Constants';

export const getTransaction = (userId) => async (dispatch) => {
  axios
    .get(`${constants.baseUrl}/api/transactions/?user=${userId}`)
    .then((res) => {
      dispatch({ type: 'USER_TRANSACTION_SUCCESS', payload: res.data });
      dispatch({ type: 'ALERT_CLEAR', message: '' });
    })
    .catch((error) => {
      dispatch({ type: 'ALERT_ERROR', message: error });
    });
};
