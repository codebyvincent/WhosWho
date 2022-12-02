import React from "react";
import { Route } from "react-router-dom";

import Home from "./Home";
import Landing from "./Landing/Landing";

const App = () => (
  <div>
    <Route exact path="/" component={Home} />
  </div>
);

export default App;
