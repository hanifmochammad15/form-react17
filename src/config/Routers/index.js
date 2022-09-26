import React, { useState } from 'react';
import { BrowserRouter, Route, Switch, Redirect  } from 'react-router-dom';
import { Header } from '../../components';
import { ADD_PATH } from '../constant';
import { LandingPage, FirstStep, SecondStep, ThirdStep, FinalStep, WrongPage, ClosePage } from '../../pages';

const Routers = () => {
  const [merchant, setMerchant] = useState({});

  const updateMerchant= (data) => {
    setMerchant((prevMerchant) => ({ ...prevMerchant, ...data }));
  };

  const resetMerchant = () => {
    setMerchant({});
  };  

  return (
    <BrowserRouter>
        <Header />
        <div className="container">
        <Switch>
        <Route
            render={(props) => (
              <LandingPage {...props} merchant={merchant} updateMerchant={updateMerchant} />
            )}
            path={ADD_PATH+"/token/:id"}
            exact={true}
          />
          <Route
            render={(props) => {
              if( localStorage.getItem('token') === null){
                return <Redirect to="/close" />
              }else{
                return  <FirstStep {...props} merchant={merchant} updateMerchant={updateMerchant} />
              }
            }
          }
            path={ADD_PATH+"/first/:id"}
            exact={true}
          />
          <Route
            render={(props) => {
              if( localStorage.getItem('token') === null){
                return <Redirect to="/close" />
              }else{
                return <SecondStep {...props} merchant={merchant} updateMerchant={updateMerchant} />            
              }
            }
          }
            path={ADD_PATH+"/second/:id"}
          />
          <Route
            render={(props) => {
              if( localStorage.getItem('token') === null){
                return <Redirect to="/close" />
              }else{
                return <ThirdStep {...props} merchant={merchant} updateMerchant={updateMerchant} resetMerchant={resetMerchant} />
              }
            }
          }
            path={ADD_PATH+"/third/:id"}
          />
          <Route
            render={(props) => (
              <FinalStep {...props} merchant={merchant} updateMerchant={updateMerchant} />
            )}
            path={ADD_PATH+"/final/:id"}
          />
          <Route
            render={(props) => (
              <WrongPage {...props} merchant={merchant} updateMerchant={updateMerchant} />
            )}
            path={ADD_PATH+"/wrong/:id"} 
          />
          <Route
            render={(props) => (
              <WrongPage {...props} merchant={merchant} updateMerchant={updateMerchant} />
            )}
            path={ADD_PATH+"/wrong"}
          />
        <Route
            render={(props) => (
              <ClosePage {...props} merchant={merchant} updateMerchant={updateMerchant} />
            )}
            path={ADD_PATH+"/close"}
          />
          {/* <Route component={Login} path="/login" />
          <Route render={() => <Redirect to="/" />} /> */}
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default Routers;