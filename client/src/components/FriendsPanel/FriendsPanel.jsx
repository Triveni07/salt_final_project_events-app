import React from 'react';
import AddFriends from '../AddFriends/AddFriends';
import FriendRequest from '../MyEvents/FriendRequest/FriendRequest';
import { UserContext } from '../UserContextWrapper/UserContextWrapper';
import CollapsibleList from '../MyEvents/CollapsibleEvents/CollapsibleEvents';
import FriendName from './FriendNames';
import './FriendsPanel.scss';


const FriendsPanel = () => (
  <>
    <UserContext.Consumer>
      {user => <AddFriends user={user} />}
    </UserContext.Consumer>
    <UserContext.Consumer>
      {user => (
        <CollapsibleList
          title="Friend Requests"
          length={user.credentials.friends.incoming.length}
        >
          {user.credentials.friends.incoming
            .map(id => <FriendRequest id={id} update={user.updateCredentials} key={id} />)}
        </CollapsibleList>
      )}
    </UserContext.Consumer>
    <UserContext.Consumer>
      {user => (
        <CollapsibleList
          title="Friends List"
          length={user.credentials.friends.accepted.length}
        >
          {user.credentials.friends.accepted.map(id => (
            <FriendName user={user} id={id} key={id} />
          ))}
        </CollapsibleList>
      )}
    </UserContext.Consumer>
  </>
);

export default FriendsPanel;
