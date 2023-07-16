import { useNavigate } from 'react-router-dom';
import { Badge, Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import { useLogoutMutation } from '../slices/usersApiSlice';
import { destroyCredentials } from '../slices/authSlice';
import SearchBox from './SearchBox';

import logo from '../assets/logo.png';

const Header = () => {
  const { cartItems } = useSelector(state => state.cart);
  const { userInfo } = useSelector(state => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logout] = useLogoutMutation();

  const logoutHandler = async () => {
    console.log(`${userInfo.name} successfully logged out`);
    try {
      await logout().unwrap();
      dispatch(destroyCredentials());
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <nav>
      <Navbar
        bg='dark'
        variant='dark'
        expand='lg'
        collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>
              <img
                src={logo}
                alt='ProShop'
              />
              ProShop
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              <SearchBox />
              <LinkContainer to='/cart'>
                <Nav.Link href='/cart'>
                  <FaShoppingCart className='nav-links' />
                  Cart{' '}
                  {cartItems.length > 0 && (
                    <Badge
                      pill
                      bg='success'
                      style={{ marginLeft: '5px' }}>
                      {cartItems.reduce((acc, cur) => acc + cur.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown
                  title={userInfo.name}
                  id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link href='/login'>
                    <FaUser className='nav-links' />
                    Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown
                  title='Admin'
                  id='adminmenu'>
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </nav>
  );
};

export default Header;
