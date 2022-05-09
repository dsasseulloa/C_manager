import React from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";
import Layout from "./Layout";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import EditConnection from "./EditConnection";
import CreateConnection from "./CreateConnection";
import Connection from "./Connection";

export default function App() {
  return (
    <div>
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/connection" component={Connection} />

            <Route path="/create" component={CreateConnection} />
            <Route path="/edit" component={EditConnection} />
          </Switch>
        </Layout>
      </Router>
    </div>
  );
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
