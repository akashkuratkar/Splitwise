/* eslint-disable no-undef */
/* eslint-disable arrow-body-style */
import React from 'react';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import axios from 'axios';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import AddExpenseModal from './AddExpenseModal';
import { converter, convertDate } from '../../constants/commonservice';
import EditGroupModal from './EditGroupModal';
import GroupRightSideBar from '../Dashboard/GroupRightSidebar';

class SelectGroup extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false,
      transactions: '',
      errorMessage: '',
      showEdit: false,
      refresh: true,
    };
  }

  componentDidMount = () => {
    this.getTransaction();
  };

  nameFieldChangeHandler = (e) => {
    e.preventDefault();
    document.getElementById('name').disabled = !document.getElementById('name').disabled;
  };

  handleModal = (modal) => {
    this.setState({ show: modal, refresh: true });
    this.getTransaction();
  };

  handleEditModal = () => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const modal = !this.state.showEdit;
    this.setState({ showEdit: modal });
    // this.getTransaction();
  };

  handleLeaveGroup = (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    const data = {
      user: this.props.user.id,
      group: this.props.selectedGroup.grp_name,
    };
    axios.post(`http://localhost:3001/api/group/leave`, data).then((response) => {
      if (response.status === 200) {
        const res = response.data;
        if (res.message === 'Group Left Successfully') {
          window.location.href = './dashboard';
        } else if (res.message === 'You cant leave group without clearing dues.') {
          this.setState({
            errorMessage: 'You cant leave group without clearing dues.',
          });
        }
      } else {
        // error
      }
    });
  };

  getTransaction = () => {
    axios.defaults.withCredentials = true;
    axios
      .get(`http://localhost:3001/api/transactions/?id=${this.props.selectedGroup.grp_id}`)
      .then((response) => {
        if (response.status === 200) {
          const { data } = response;
          this.setState({
            transactions: data,
          });
        } else {
          // error
        }
      });
  };

  render() {
    const classes = makeStyles((theme) => ({
      root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
      },
    }));

    return (
      <>
        <Row>
          <Col md={8}>
            <Row>
              <div style={{ 'background-color': '#eeeeee', width: '100%' }} className="card">
                <div className="card-body">
                  <Row>
                    <Col md={2}>
                      <form onSubmit={this.onFileUpload} encType="multipart/form-data">
                        {this.props.selectedGroup.image_path !== '' ? (
                          <Avatar
                            src={this.props.selectedGroup.image_path}
                            className="img-fluid"
                            alt={
                              this.props.groups.filter(
                                (grp) => grp.grp_name === this.props.selectedGroup
                              ).image_path
                            }
                            onChange={this.onFileChange}
                          />
                        ) : (
                          <Avatar
                            width="100"
                            height="100"
                            className="img-fluid"
                            alt=""
                            src="https://assets.splitwise.com/assets/core/logo-square-65a6124237868b1d2ce2f5db2ab0b7c777e2348b797626816400534116ae22d7.svg"
                          />
                        )}
                      </form>
                    </Col>
                    <Col md={3}>
                      <div className="form-label-group">
                        <Typography>{this.props.selectedGroup.grp_name}</Typography>
                      </div>
                    </Col>

                    <Col md={4}>
                      <Button
                        variant="primary"
                        style={{
                          'background-color': '#ff652f',
                          'border-color': '#5bc5a7',
                        }}
                        className="btn btn-2 btn-success pull-right text-uppercase"
                        type="submit"
                        id="location"
                        onClick={this.handleModal}
                      >
                        Add Expenses
                      </Button>
                    </Col>
                    <Col md={3}>
                      <Button
                        style={{
                          'background-color': '#5bc5a7',
                          'border-color': '#5bc5a7',
                        }}
                        type="submit"
                        id="location"
                        onClick={this.handleEditModal}
                      >
                        Edit Group
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
              <Row>
                <Col md={12}>
                  {this.state.errorMessage !== '' ? (
                    <div className="alert alert-danger" role="alert">
                      {this.state.errorMessage}
                    </div>
                  ) : null}
                  <List component="nav" className={classes.root} style={{ width: '100%' }}>
                    {this.state.transactions.length > 0 ? (
                      this.state.transactions.map((r) => (
                        <ListItem style={{ width: '100%' }} button>
                          <Col md={1.5}>
                            <ListItemAvatar>
                              <div className="date">
                                <img
                                  src="https://s3.amazonaws.com/splitwise/uploads/category/icon/square_v2/uncategorized/general@2x.png"
                                  width="100"
                                  height="100"
                                  className="img-fluid"
                                  alt=""
                                />
                              </div>
                            </ListItemAvatar>
                          </Col>
                          <Col md={5}>
                            <ListItemText
                              primary={r.tran_name}
                              secondary={
                                <Typography className="header-label">
                                  {convertDate(r.created_on)}
                                </Typography>
                              }
                            />
                          </Col>
                          <Col md={3} style={{ 'text-align': 'end' }}>
                            {r.status === 'PENDING' && (
                              <ListItemText
                                primary=""
                                secondary={
                                  r.paid_by === this.props.user.id ? (
                                    <Typography
                                      style={{
                                        'text-transform': 'uppercase',
                                        color: '#5bc5a7',
                                      }}
                                    >
                                      you paid{' '}
                                      {converter(this.props.user.default_currency).format(
                                        r.bill_amt
                                      )}
                                    </Typography>
                                  ) : (
                                    <Typography
                                      style={{
                                        'text-transform': 'uppercase',
                                        color: '#ff652f',
                                      }}
                                    >
                                      {this.props.users
                                        .filter((us) => us.id === r.paid_by)
                                        .map((r1) => {
                                          return r1.name;
                                        })}{' '}
                                      paid{' '}
                                      {converter(this.props.user.default_currency).format(
                                        r.bill_amt
                                      )}{' '}
                                    </Typography>
                                  )
                                }
                              />
                            )}
                          </Col>
                          <Col md={4}>
                            <ListItemText
                              primary=""
                              secondary={
                                r.paid_by === this.props.user.id ? (
                                  <Typography className="header-label">
                                    you will get back{' '}
                                    {converter(this.props.user.default_currency).format(
                                      r.bill_amt - r.amount
                                    )}
                                  </Typography>
                                ) : (
                                  <Typography className="header-label">
                                    you owe{' '}
                                    {this.props.users
                                      .filter((us) => us.id === r.paid_by)
                                      .map((r1) => {
                                        return r1.name;
                                      })}{' '}
                                    &nbsp;
                                    {converter(this.props.user.default_currency).format(r.amount)}
                                  </Typography>
                                )
                              }
                            />
                          </Col>
                        </ListItem>
                      ))
                    ) : (
                      <ListItem>
                        <ListItemText primary="No transactions!" />
                      </ListItem>
                    )}
                  </List>
                </Col>
              </Row>
            </Row>
          </Col>
          <Col md={4}>
            <GroupRightSideBar
              data={this.props.selectedGroup.grp_id}
              screen="group"
              refresh={this.state.refresh}
            />
          </Col>
        </Row>
        {this.state.show && (
          <AddExpenseModal show={this.handleModal} group={this.props.selectedGroup} />
        )}
        {this.state.showEdit && (
          <EditGroupModal showEdit={this.handleEditModal} group={this.props.selectedGroup} />
        )}
      </>
    );
  }
}
SelectGroup.propTypes = {
  user: PropTypes.objectOf.isRequired,
  selectedGroup: PropTypes.func.isRequired,
  groups: PropTypes.objectOf.isRequired,
  users: PropTypes.func.isRequired,
};

const mapStatetoProps = (state) => {
  return {
    user: state.user,
    alert: state.alert,
    groups: state.groups,
    transactions: state.transactions,
    users: state.users,
  };
};
export default connect(mapStatetoProps)(SelectGroup);
