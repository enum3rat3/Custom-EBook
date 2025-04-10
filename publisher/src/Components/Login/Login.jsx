import { useKeycloak } from '@react-keycloak/web';
import React,{useEffect} from 'react';

const Login = () => {
    const {keycloak}=useKeycloak();

      useEffect(()=>{
        if(!keycloak?.authenticated){
          keycloak.login({
            redirectUri: window.location.origin + '/'  
        } );
      }
      },[]) 
  return (
    <div>..............</div>
  )
}

export default Login