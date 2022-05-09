import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  container: {
    marginTop: theme.spacing(2),
    position: "fixed",
    width: "100%",
    height: "80%",
    overflow: "auto",
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  secondaryBar: {
    zIndex: 0,
  },
}));

export default function Layout({ children }) {
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function HeaderView() {
    let path = location.pathname;
    if (path === "/") return <span>Homepage</span>;
    var pageName = path.slice(1);
    return <span>{pageName}</span>;
  }

  function currentTab() {
    let path = location.pathname;
    if (path === "/") return 0;
    else if (path === "/connection") return 1;
    else if (path === "/create") return 2;
    else if (path === "/edit") return 3;
  }

  const [value, setValue] = React.useState(currentTab());

  const classes = useStyles();

  const allTabs = ["/", "/connection", "/create", "/edit"];

  return (
    <div className="App wrapper">
      <AppBar
        component="div"
        className={classes.secondaryBar}
        color="primary"
        position="static"
        elevation={0}
      >
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography color="inherit" variant="h5" component="h1">
                CManager
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <AppBar
        component="div"
        className={classes.secondaryBar}
        color="primary"
        position="static"
        elevation={0}
      >
        <Tabs value={value} onChange={handleChange}>
          <Tab
            textColor="inherit"
            label="Home"
            value={0}
            component={Link}
            to={allTabs[0]}
          />
          <Tab
            textColor="inherit"
            label="Connections"
            value={1}
            component={Link}
            to={allTabs[1]}
          />
          <Tab
            textColor="inherit"
            label="Create"
            value={2}
            component={Link}
            to={allTabs[2]}
          />
        </Tabs>
      </AppBar>

      <AppBar
        component="div"
        className={classes.secondaryBar}
        color="default"
        position="static"
        elevation={0}
      >
        <Toolbar variant="dense">
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography color="inherit" variant="subtitle1">
                CManager :: {HeaderView()}
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <Container className={classes.container} maxWidth="{false}">
        <Paper className={classes.paper}>{children}</Paper>
      </Container>
    </div>
  );
}
