import React, { Component, useState, useReducer, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from "@material-ui/core/NativeSelect";
import Box from "@material-ui/core/Box";
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from "@material-ui/core/Checkbox";
import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import ipmask from "../services/utils/ipmask";
import { useLocation, useHistory } from "react-router-dom";
import slugify from '../services/utils/slugify'
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(0, 1, 4),
  },
}));

export default function Edit() {
  const initialConnectionState = {
    name: "",
    type: "Ethernet",
    ninterface: "eth0",
    description: "",

    ipv4mode: "ipv4NoAddress",
    ipv4IpAddress: "",
    ipv4BitMask: "",
    ipv4Gateway: "",
    ipv4Dns: "",

    ipv6mode: "ipv6NoAddress",
    ipv6IpAddress: "",
    ipv6Prefix: "",
    ipv6Gateway: "",
    ipv6Dns: "",

    automaticConection: true,
    primaryConection: false,
  };

  const messageState = {
    errorMsg: "",
    successMsg: "",
  };

  const reducer = (state, action) => {
    if (action.type === "connectionReset") {
      return initialConnectionState;
    }
    const result = { ...state };
    result[action.type] = action.value;
    return result;
  };

  const handleCheckbox = (event) => {
    const { name, value } = event.target;
    setConnectionState({ type: name, value: event.target.checked });
  };

  const [connectionState, setConnectionState] = useReducer(
    reducer,
    initialConnectionState
  );
  const [message, setMessages] = useReducer(reducer, messageState);

  const {
    name,
    type,
    ninterface,
    description,
    ipv4mode,
    ipv4IpAddress,
    ipv4BitMask,
    ipv4Gateway,
    ipv4Dns,
    ipv6mode,
    ipv6IpAddress,
    ipv6Prefix,
    ipv6Gateway,
    ipv6Dns,

    automaticConection,
    primaryConection,
  } = connectionState;
  const { successMsg, errorMsg } = message;

  const classes = useStyles();

  const handleConnection = (e) => {
    const { name, value } = e.target;
    if (name === "ipv4mode") {
      resetIpv4Changes();
    } else if (name === "ipv6mode") {
      resetIpv6Changes();
    }
    setConnectionState({ type: name, value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    var data = {
      name: name.slugify(),
      type: type,
      ninterface: ninterface,
      description: description,
      ipv4mode: ipv4mode,
      ipv4IpAddress: ipv4IpAddress,
      ipv4BitMask: ipv4BitMask,
      ipv4Gateway: ipv4Gateway,
      ipv4Dns: ipv4Dns,
      ipv6mode: ipv6mode,
      ipv6IpAddress: ipv6IpAddress,
      ipv6Prefix: ipv6Prefix,
      ipv6Gateway: ipv6Gateway,
      ipv6Dns: ipv6Dns,
      automaticConection: automaticConection,
      primaryConection: primaryConection,
    };

    fetch("http://127.0.0.1:8000/api/update-connection", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.ok) {
        res.json().then((result) => {
          setMessages({
            type: "successMsg",
            value: "Connection successfuly edited",
          });
          setTimeout(() => {
            setMessages({
              type: "successMsg",
              value: "",
            });
          }, 2500);
        });
      } else {
        res.json().then((result) => {
          setMessages({ type: "errorMsg", value: result.message });
          setTimeout(() => {
            setMessages({
              type: "errorMsg",
              value: "",
            });
          }, 2500);

        });
      }
    });
  };

  const resetChanges = () => {
    setConnectionState({ type: "connectionReset" });
  };
  const resetIpv4Changes = () => {
    setConnectionState({ type: "ipv4IpAddress", value: "" });
    setConnectionState({ type: "ipv4BitMask", value: "" });
    setConnectionState({ type: "ipv4Gateway", value: "" });
  };
  const resetIpv6Changes = () => {
    setConnectionState({ type: "ipv6IpAddress", value: "" });
    setConnectionState({ type: "ipv6Prefix", value: "" });
    setConnectionState({ type: "ipv6Gateway", value: "" });
  };

  let location = useLocation();
  const connection_name = location.pathname.split("::")[1];

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/connection?name=" + connection_name)
      .then((res) => res.json())
      .then((result) => {
        setConnectionState({ type: "name", value: result.name });
        setConnectionState({ type: "type", value: result.type });
        setConnectionState({
          type: "ninterface",
          value: result.ninterface,
        });
        setConnectionState({
          type: "description",
          value: result.description,
        });
        setConnectionState({ type: "ipv4mode", value: result.ipv4mode });
        setConnectionState({ type: "ipv6mode", value: result.ipv6mode });
        setConnectionState({
          type: "ipv4IpAddress",
          value: result.ipv4IpAddress,
        });
        setConnectionState({
          type: "ipv4BitMask",
          value: result.ipv4BitMask,
        });
        setConnectionState({
          type: "ipv4Gateway",
          value: result.ipv4Gateway,
        });
        setConnectionState({ type: "ipv4Dns", value: result.ipv4Dns });
        setConnectionState({
          type: "ipv6IpAddress",
          value: result.ipv6IpAddress,
        });
        setConnectionState({
          type: "ipv6Prefix",
          value: result.ipv6Prefix,
        });
        setConnectionState({
          type: "ipv6Gateway",
          value: result.ipv6Gateway,
        });
        setConnectionState({ type: "ipv6Dns", value: result.ipv6Dns });
        setConnectionState({
          type: "automaticConection",
          value: result.automaticConection,
        });
        setConnectionState({
          type: "primaryConection",
          value: result.primaryConection,
        });
      });
  }, [connection_name]);

  const history = useHistory();

  const RedirectConnection = () => {
    let path = "/connection";
    history.push(path);
  };

  return (
    <div className="App wrapper">
      <form onSubmit={handleSubmit} id="create-connection-form">
        <Grid container spacing={2}>
          <Grid item xs={12} align="center">
            <Collapse in={errorMsg != "" || successMsg != ""}>
              {successMsg != "" ? (
                <Alert
                  severity="success"
                  onClose={() => {
                    setMessages({ type: "successMsg", value: "" });
                  }}
                >
                  {successMsg}
                </Alert>
              ) : (
                <Alert
                  severity="error"
                  onClose={() => {
                    setMessages({ type: "errorMsg", value: "" });
                  }}
                >
                  {errorMsg}
                </Alert>
              )}
            </Collapse>
          </Grid>

          <Grid item xs={6} md={6} sm={6}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Save
            </Button>
            <Button
              type="button"
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={RedirectConnection}
            >
              Cancel
            </Button>

            <Grid container spacing={2}>
              <Grid item xs={12} md={12} sm={12}>
                <TextField
                  disabled
                  autoComplete="name"
                  name="name"
                  variant="outlined"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  value={name}
                  onChange={handleConnection}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} md={12} sm={12}>
                <FormControl style={{ minWidth: "100%" }}>
                  <InputLabel htmlFor="demo-customized-select-native">
                    Type
                  </InputLabel>
                  <NativeSelect
                    value={type}
                    onChange={handleConnection}
                    inputProps={{
                      name: "type",
                      id: "demo-customized-select-native",
                    }}
                  >
                    <option value="Ethernet">Ethernet</option>
                  </NativeSelect>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={12} sm={12}>
                <FormControl style={{ minWidth: "100%" }}>
                  <InputLabel htmlFor="demo-customized-select-native">
                    Interface
                  </InputLabel>
                  <NativeSelect
                    value={ninterface}
                    onChange={handleConnection}
                    inputProps={{
                      name: "ninterface",
                      id: "demo-customized-select-native",
                    }}
                  >
                    <option value="eth0">eth0</option>
                    <option value="eth1">eth1</option>
                    <option value="eth2">eth2</option>
                    <option value="eth3">eth3</option>
                    <option value="eth4">eth4</option>
                    <option value="eth5">eth5</option>
                    <option value="eth6">eth6</option>
                    <option value="eth7">eth7</option>
                    <option value="eth8">eth8</option>
                  </NativeSelect>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={12} sm={12}>
                <TextField
                  name="description"
                  variant="outlined"
                  required
                  fullWidth
                  id="description"
                  label="Description"
                  value={description}
                  onChange={handleConnection}
                />
              </Grid>
            </Grid>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend"></FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={automaticConection}
                      onChange={handleCheckbox}
                      name="automaticConection"
                    />
                  }
                  label="Connect Automatically"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={primaryConection}
                      onChange={handleCheckbox}
                      name="primaryConection"
                    />
                  }
                  label="Primary Connection"
                />
              </FormGroup>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={6} sm={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12} sm={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">IPv4 Mode:</FormLabel>
                  <RadioGroup
                    name="ipv4mode"
                    value={ipv4mode}
                    onChange={handleConnection}
                  >
                    <FormControlLabel
                      name="ipv4mode"
                      value="ipv4NoAddress"
                      control={<Radio />}
                      label="No IPv4 Address"
                    />
                    <FormControlLabel
                      name="ipv4mode"
                      value="ipv4Dhcp"
                      control={<Radio />}
                      label="DHCP"
                    />
                    <FormControlLabel
                      name="ipv4mode"
                      value="ipv4Static"
                      control={<Radio />}
                      label="Static"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              {ipv4mode === "ipv4Static" ? (
                <Grid item xs={12} md={12} sm={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="IP Address"
                    name="ipv4IpAddress"
                    value={ipv4IpAddress}
                    onChange={handleConnection}
                    size="small"
                    InputProps={{
                      inputComponent: ipmask,
                    }}
                  />
                </Grid>
              ) : null}
              {ipv4mode === "ipv4Static" ? (
                <Grid item xs={12} md={12} sm={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="username"
                    label="BitMask"
                    name="ipv4BitMask"
                    value={ipv4BitMask}
                    onChange={handleConnection}
                    size="small"
                    InputProps={{
                      inputComponent: ipmask,
                    }}
                  />
                </Grid>
              ) : null}
              {ipv4mode === "ipv4Static" ? (
                <Grid item xs={12} md={12} sm={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="username"
                    label="Gateway IP"
                    name="ipv4Gateway"
                    value={ipv4Gateway}
                    onChange={handleConnection}
                    size="small"
                    InputProps={{
                      inputComponent: ipmask,
                    }}
                  />
                </Grid>
              ) : null}
              <Grid item xs={12} md={12} sm={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="username"
                  label="IPv4 DNS Server"
                  name="ipv4Dns"
                  value={ipv4Dns}
                  onChange={handleConnection}
                  size="small"
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={12} sm={12}>
                <FormControl component="fieldset">
                  <Box mt={3}>
                    <FormLabel component="legend">IPv6 Mode:</FormLabel>
                    <RadioGroup
                      name="ipv6mode"
                      value={ipv6mode}
                      onChange={handleConnection}
                    >
                      <FormControlLabel
                        name="ipv6mode"
                        value="ipv6NoAddress"
                        control={<Radio />}
                        label="No IPv6 Address"
                      />
                      <FormControlLabel
                        name="ipv6mode"
                        value="ipv6Dhcp"
                        control={<Radio />}
                        label="Stateful DHCP"
                      />
                      <FormControlLabel
                        name="ipv6mode"
                        value="ipv6Static"
                        control={<Radio />}
                        label="Static"
                      />
                    </RadioGroup>
                  </Box>
                </FormControl>
              </Grid>
              {ipv6mode === "ipv6Static" ? (
                <Grid item xs={12} md={12} sm={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="IP Address"
                    name="ipv6IpAddress"
                    value={ipv6IpAddress}
                    onChange={handleConnection}
                    size="small"
                  />
                </Grid>
              ) : null}
              {ipv6mode === "ipv6Static" ? (
                <Grid item xs={12} md={12} sm={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="username"
                    label="Prefix Length"
                    name="ipv6Prefix"
                    value={ipv6Prefix}
                    onChange={handleConnection}
                    size="small"
                  />
                </Grid>
              ) : null}
              {ipv6mode === "ipv6Static" ? (
                <Grid item xs={12} md={12} sm={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="username"
                    label="Gateway IP"
                    name="ipv6Gateway"
                    value={ipv6Gateway}
                    onChange={handleConnection}
                    size="small"
                  />
                </Grid>
              ) : null}
              <Grid item xs={12} md={12} sm={12}>
                <TextField
                  name="ipv6Dns"
                  variant="outlined"
                  required
                  fullWidth
                  id="username"
                  label="IPv6 DNS Server"
                  value={ipv6Dns}
                  onChange={handleConnection}
                  size="small"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
