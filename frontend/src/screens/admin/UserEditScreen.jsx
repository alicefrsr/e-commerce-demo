import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import FormContainer from '../../components/FormContainer';

import { useGetUserDetailsQuery, useUpdateUserMutation } from '../../slices/usersApiSlice';

const UserEditScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const { id: userId } = useParams();
  const { data: user, isLoading, refetch, error } = useGetUserDetailsQuery(userId);
  //   console.log(user);
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const submitHandler = async e => {
    e.preventDefault();
    // console.log('submit update');
    try {
      await updateUser({
        // _id: userId, // slice mutation: url: `${USERS_URL}/${data._id}`,
        userId, // slice mutation: url: `${USERS_URL}/${data.userId}`,
        name,
        email,
        isAdmin,
      });
      toast.success('User updated successfully');
      refetch();
      navigate('/admin/userlist');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }

    // from product:
    // const updatedUser = {
    //   _id: userId, // userId from the url (slice: url: `${USERS_URL}/${data._id}`,)
    //   // we could have just userId but in the slice have: url: USERS_URL/data.userId // same
    //   name,
    //   email,
    //   isAdmin,
    // };

    // const result = await updateUser(updatedUser);
    // if (result.error) {
    //   toast.error(result.error);
    // } else {
    //   console.log(updatedUser);
    //   toast.success('Product updated');
    //   navigate('/admin/productlist');
    // }
  };

  return (
    <>
      <Link
        to='/admin/userlist'
        className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group
              controlId='name'
              className='my-2'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter name'
                value={name}
                onChange={e => setName(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group
              controlId='email'
              className='my-2'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={e => setEmail(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group
              controlId='image'
              className='my-2'>
              <Form.Check
                type='checkbox'
                label='Is Admin'
                checked={isAdmin} //
                onChange={e => setIsAdmin(e.target.checked)}></Form.Check>
            </Form.Group>

            <Button
              type='submit'
              variant='primary'
              className='my-2'>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
