import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector(state => state.auth);

  // redirect to shipping if already logged in
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';
  // const redirect = sp.get('redirect');

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async e => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      console.log('login successful');
      //   console.log(`${userInfo.name} successfully logged in`);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };
  return (
    <FormContainer>
      <h1>Sign in</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group
          controlId='email'
          className='my-3'>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={e => setEmail(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Group
          controlId='password'
          className='my-3'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={e => setPassword(e.target.value)}></Form.Control>
        </Form.Group>

        <Button
          type='submit'
          variant='primary'
          className='mt-2'
          disabled={isLoading}>
          Sign in
        </Button>
        {isLoading && <Loader />}
      </Form>
      <Row className='py-3'>
        <Col>
          New customer? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;