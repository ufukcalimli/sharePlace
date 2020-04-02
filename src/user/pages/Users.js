import React from 'react';

import UsersList from '../components/UsersList';

const Users = () => {
  const USERS = [
    {
      id: 'u1',
      name: 'kamil',
      image:
        'https://2.bp.blogspot.com/-SngdakT_WIM/UAhAXkJNzcI/AAAAAAAA1r8/MEKy-DNkaIo/s1600/uvs120719-020.jpg',
      places: 3,
    },
  ];

  return <UsersList items={USERS} />;
};

export default Users;
