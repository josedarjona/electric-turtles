import React from 'react';
import { history } from 'lib';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import ApplicationForm from './ApplicationForm';

const TestComponent = () => <h1>READY TO LEARN??</h1>;

const App = () => (
  <Router history={history}>
    <Layout>
      <Routes>
        <Route path="/" element={<TestComponent />} />
        <Route exact path="/application" element={<ApplicationForm />} />
      </Routes>
    </Layout>
  </Router>
);

export default App;
