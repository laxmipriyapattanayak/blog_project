import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../services/UserService';


const Login = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (event) => {
    setValue((prevState) => {
      return {...prevState, [event.target.name]: event.target.value};
    });
  };

  const handleSubmit = async(event) => {
    event.preventDefault();
    try {
      const response = await loginUser(value)
      navigate('/profile',{
        state: response.data.user,
      });
    } catch (error) {
      toast(error.response.data.error.message);
    }
  };
  return (
    <div>
      <h1>User Login</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label html for="email">Email:</label>
            <input 
              type='email'
              name='email'
              id='email'
              value={value.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor='password'>password</label>
            <input
              type='password'
              name='password'
              id='password'
              placeholder='password must be 6 characters'
              value={value.password}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <button type="submit" >
              login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;