import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  loadFullUserFriendsIds
} from "../../redux/modules/friends";
import {
  loadUsersList, searchUsersByString
} from "../../redux/modules/people";
import {asyncConnect} from "redux-connect";
import authenticated from "../../helpers/authenticated";
import PeopleAvatar from "../../components/People/PeopleAvatar";
import FriendsSearch from "../../components/Friends/FriendsSearch";

const SEARCH_DELAY_TIME = 500;

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {
    if (getState().auth && getState().auth.registeredUser && getState().auth.registeredUser.userToken) {
      const userToken = getState().auth.registeredUser.userToken.token;
      const promises = [];

      promises.push(dispatch(loadUsersList()));

      promises.push(dispatch(loadFullUserFriendsIds(userToken)));

      return Promise.all(promises).then(() => {});
    }
  }
}])
@authenticated
@connect(
  state => ({
    people: state.people.peoples,
    friendsIds: state.friends.fullFriendsIds,
    auth: state.auth
  })
)
export default class Friends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoginSelected: true,
      displayedIndexes: [],
      searchValue: null,
      times: 0
    }
  }

  static propTypes = {
    people: PropTypes.array,
    friendsIds: PropTypes.array,
    friendsSearchIds: PropTypes.array,
    auth: PropTypes.object,
  };

  static defaultProps = {
    people: [],
    friendsIds: [],
    friendsSearchIds: [],
    auth: {},
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  handleUsersSearch(event) {
    this.event = event;
    this.setState({ searchValue: event.target.value });

    clearInterval(this.timeout);
    this.timeout = setTimeout(() => {
      const { dispatch } = this.context.store;

      if (this.state.searchValue) {
        dispatch(searchUsersByString(this.state.searchValue))
          .then((response) => {
            const idsList = response.data && response.data.hits && response.data.hits.length
              ? response.data.hits.map((hit, index) => ({ id: Number(hit._id), order: index }))
              : [];
            return dispatch(loadUsersList(idsList.map(item => item.id), null, null, idsList));
          })
      } else {
        dispatch(loadUsersList());
      }
    }, SEARCH_DELAY_TIME, event);
  }

  renderUsersList() {
    const { people, friendsIds, auth } = this.props;
    return (
      people && people.length ? people.map((people, index) =>
        <PeopleAvatar
          people={people}
          isFriend={friendsIds.includes(people.id)}
          displayed={this.state.displayedIndexes.includes(index) || this.state.displayedIndexes[0] === 'all'}
          token={auth.token}
        />
      ) : ''
    );
  }

  render() {
    require('./People.scss');
    return [
      <div className="content">
        <div className={`friends-container route-container`}>
          <FriendsSearch onChange={(event) => this.handleUsersSearch(event)} />
          <div className="friends-list">
            {this.renderUsersList()}
          </div>
        </div>
      </div>,
      <div className="right-content" />
    ];
  }
}