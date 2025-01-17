import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

class UserList extends Component {
  _initFirebase = false;

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
    };
  }

  firebaseInit = () => {
    if (this.props.firebase && !this._initFirebase) {
      this._initFirebase = true;

      this.setState({ loading: true });

      this.unsubscribe = this.props.firebase
        .users()
        .onSnapshot(snapshot => {
          let users = [];

          snapshot.forEach(doc =>
            users.push({ ...doc.data(), uid: doc.id }),
          );
          this.setState({
            users,
            loading: false,
          });
        });  
    }
  };

  componentDidMount() {
    this.firebaseInit();
  }

  componentDidUpdate() {
    this.firebaseInit();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { users, loading } = this.state;

    return (
      <div>
        <h2>Users</h2>
        {loading && <div>Loading ...</div>}

        <ul>
          {users.map(user => (
            <li key={user.uid}>
              <span>
                <strong>ID:</strong> {user.uid}
              </span>
              <span>
                <strong>E-Mail:</strong> {user.email}
              </span>
              <span>
                <strong>Username:</strong> {user.username}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default withFirebase(UserList);
