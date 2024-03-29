/* eslint-disable import/prefer-default-export */
/* eslint-disable arrow-body-style */
import axios from 'axios';
import constants from '../../constants/Constants';

export const getUsers = () => async (dispatch) => {
  axios
    .get(`${constants.baseUrl}/api/users/`)
    .then((res) => {
      dispatch({ type: 'USER_LIST_SUCCESS', payload: res.data });
      dispatch({ type: 'ALERT_CLEAR', message: '' });
    })
    .catch((error) => {
      dispatch({ type: 'ALERT_ERROR', message: error });
    });
};
