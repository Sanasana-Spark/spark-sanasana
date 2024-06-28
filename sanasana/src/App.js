import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SignIn from './components/onboarding/signIn/SignIn';
import Step1 from './components/onboarding/signUp/Step1';
import Step2 from './components/onboarding/signUp/Step2';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/sign-in" component={SignIn} />
          <Route path="/step1" component={Step1} />
          <Route path="/step2" component={Step2} />
          <Route path="/" component={SignIn} /> {/* Default route */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
