import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { FaTimes, FaTrash, FaEdit, FaCheck } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/usersApiSlice';

const UserListScreen = () => {
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const deleteUserHandler = async id => {
    console.log('user removed:', id);
    if (window.confirm('This will permmanently delete this user from the database. Are you sure you want to proceed? ')) {
      try {
        await deleteUser(id);
        refetch(); // brought in from the query (useGetUserssQuery)
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  return (
    <>
      <h1>Users</h1>
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table
          striped
          hover
          responsive
          className='table-sm'>
          <thead>
            <tr>
              <th>USER ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>{user.isAdmin}</td>
                <td>{user.isAdmin ? <FaCheck style={{ color: 'green' }} /> : <FaTimes style={{ color: 'red' }} />}</td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button
                      variant='light'
                      className='btn-sm mx-2'>
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                  <Button
                    variant='danger'
                    className='btn-sm mx-2 '
                    onClick={() => deleteUserHandler(user._id)}>
                    <FaTrash style={{ color: 'white' }} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};
export default UserListScreen;
