import React from "react";
import { Grid, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

export default function HomePage() {
  const classes = useStyles();

  const history = useHistory();

  const RedirectConnection = () => {
    let path = "/connection";
    history.push(path);
  };
  const RedirectCreateConnection = () => {
    let path = "/create";
    history.push(path);
  };

  return (
    <div className={classes.root}>
      <h1>Fullstack Challenge</h1>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} sm={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={RedirectConnection}
          >
            List Connections
          </Button>
        </Grid>
        <Grid item xs={12} md={12} sm={12}>
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={RedirectCreateConnection}
          >
            Create a new Connection
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
