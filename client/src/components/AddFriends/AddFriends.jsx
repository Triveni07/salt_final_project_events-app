import React, { Component, createRef } from 'react';
import axios from 'axios';
import './AddFriends.scss';

class AddFriends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      query: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.inputRef = createRef();
  }

  /* eslint-disable */
  componentDidMount() {
    axios.get('/api/user')
      .then(response => this.setState(prevState => ({ ...prevState, users: response.data })));
  }

  filterUsers(users) {
    const { user } = this.props;
    const { query } = this.state;
    const { friends } = user.credentials;
    const friendIds = [...friends.accepted, ...friends.incoming, ...friends.outgoing];

    const jsx = users
      .filter(currUser => currUser._id !== user.credentials._id)
      .filter(user => user.userName.toLowerCase().trim().startsWith(query.trim().toLowerCase()))
      .map((user) => {
        if (friendIds.includes(user._id)) {
          return this.renderFriend(user);
        } else {
          return this.renderNonFriend(user);
        }
      });

    return jsx;
  }

  renderFriend(user) {
    return (
      <div
        className="add-friend-suggestion add-friend-suggestion--friend"
        data-userId={user._id}
      >
        <i className="fas fa-user" />
        <span className="user-name">{user.userName}</span>
      </div>
    )
  }

  renderNonFriend(user) {
    return (
      <div
        className="add-friend-suggestion"
        onClick={() => this.handleClick(user._id)}
      >
        <i className="fas fa-user-plus" />
        <span className="user-name">{user.userName}</span>
      </div>
    );
  }

  handleChange(e) {
    const { value } = e.target;
    this.setState(prevState => ({ ...prevState, query: value }));
  }

  handleClick(id) {
    const { user } = this.props;
    this.setState(prevState => ({ ...prevState, query: '' }));
    this.inputRef.current.value = '';

    axios.post('/api/user/friend/send', { id })
      .then(res => {
        user.updateCredentials();
      })
      .catch(err => console.log(err));
  }

  render() {
    const { users, query } = this.state;

    return (
      <div className="add-friends">
        <input 
          ref={this.inputRef}
          className="add-friends-input"
          placeholder="Find new friends.."
          onChange={this.handleChange} 
        />
        <div className="add-friends-dropdown">
          {query.length >= 3 && this.filterUsers(users)}
        </div>
      </div>
    );
  }
}

export default AddFriends;
