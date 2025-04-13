import { useKeycloak } from '@react-keycloak/web';
import React,{useEffect} from 'react';
import CustomLoadingPage from '../../Utils/CustomLoadingPage';

const Login = () => {
    const {keycloak,initialized}=useKeycloak();

      useEffect(()=>{
        if(!keycloak?.authenticated){
          keycloak.login({
            redirectUri: window.location.origin + '/'  
        } );
      }
      },[]) 

      if(!initialized){
        return <CustomLoadingPage/>
      }
  return (
    <div>..............</div>
  )
}

export default Login