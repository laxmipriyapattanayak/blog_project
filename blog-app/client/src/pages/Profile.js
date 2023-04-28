import React,{useEffect,useCallback} from 'react'
import { useLocation } from 'react-router-dom';
import { getRefreshToken } from '../services/UserService';

const Profile = () => {
    const location = useLocation();
    const { state } = location;

    const handleRefresh = useCallback(async () => {
      try{
        const refreshToken = await getRefreshToken();
        console.log(refreshToken);
      }catch(error) {
        console.log(error);
      }

    },[]);
    useEffect(() => {
      const interval = setInterval(() => {
        handleRefresh()
      }, 1000 * 20);
      return () => clearInterval(interval)
    }, [handleRefresh])

  return (
    <div> 
       <h2>{state.isAdmin ? 'Admin' : 'User'} Profile </h2>
       <div>
        {state && (
            <div>
                <h3>name:{state.name}</h3>
                <p>Email:{state.email}</p>
                <p>phone:{state.phone}</p>
                <div>
                    <button>update</button>
                    <button>delete</button>
                </div>
            </div>
        )}
       </div>
    </div>
  );
};

export default Profile;