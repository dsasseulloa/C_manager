import React, { useReducer } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(0, 1, 4),
  },
}));

export default function Edit(props) {
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
        });
      }
    });
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

  return (
    <div className="App wrapper">
      <form onSubmit={handleSubmit} id="create-connection-form">
        <Container className={classes.container} maxWidth="{false}">
          <Paper className={classes.paper}>
            <Grid container spacing={3}>
              <Grid item xs={3} md={3} sm={3}>
                <TextField
                  id="outlined-read-only-input"
                  label="Name"
                  defaultValue={props.data.rowData.name}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={3} md={3} sm={3}>
                <TextField
                  id="outlined-read-only-input"
                  label="Type"
                  defaultValue={props.data.rowData.type}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                  fullWidth
                />
              </Grid>

              <Grid item xs={3} md={3} sm={3}>
                <TextField
                  id="outlined-read-only-input"
                  label="Interface"
                  defaultValue={props.data.rowData.ninterface}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={3} md={3} sm={3}>
                <TextField
                  id="outlined-multiline-static"
                  label="Description"
                  defaultValue={props.data.rowData.description}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                  fullWidth
                />
              </Grid>

              <Grid item xs={1} md={1} sm={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">IPv4 Mode:</FormLabel>
                  <RadioGroup
                    name="ipv4mode"
                    value={props.data.rowData.ipv4mode}
                  >
                    {props.data.rowData.ipv4mode === "ipv4NoAddress" ? (
                      <FormControlLabel
                        name="ipv4mode"
                        value="ipv4NoAddress"
                        control={<Radio />}
                        label="No IPv4 Address"
                      />
                    ) : null}
                    {props.data.rowData.ipv4mode === "ipv4Dhcp" ? (
                      <FormControlLabel
                        name="ipv4mode"
                        value="ipv4Dhcp"
                        control={<Radio />}
                        label="DHCP"
                      />
                    ) : null}
                    {props.data.rowData.ipv4mode === "ipv4Static" ? (
                      <FormControlLabel
                        name="ipv4mode"
                        value="ipv4Static"
                        control={<Radio />}
                        label="Static"
                      />
                    ) : null}
                  </RadioGroup>
                </FormControl>
              </Grid>
              {props.data.rowData.ipv4mode === "ipv4Static" ? (
                <Grid item xs={2} md={2} sm={12}>
                  <TextField
                    id="outlined-multiline-static"
                    label="IP Address"
                    defaultValue={props.data.rowData.ipv4IpAddress}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
              ) : null}
              {props.data.rowData.ipv4mode === "ipv4Static" ? (
                <Grid item xs={2} md={2} sm={12}>
                  <TextField
                    id="outlined-multiline-static"
                    label="BitMask"
                    defaultValue={props.data.rowData.ipv4BitMask}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
              ) : null}
              {props.data.rowData.ipv4mode === "ipv4Static" ? (
                <Grid item xs={2} md={2} sm={12}>
                  <TextField
                    id="outlined-multiline-static"
                    label="Gateway IP"
                    defaultValue={props.data.rowData.ipv4Gateway}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
              ) : null}
              <Grid item xs={2} md={3} sm={12}>
                <TextField
                  id="outlined-multiline-static"
                  label="IPv4 DNS Server"
                  defaultValue={props.data.rowData.ipv4Dns}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={12} sm={12}>
                <span></span>
              </Grid>

              <Grid item xs={1} md={1} sm={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">IPv6 Mode:</FormLabel>
                  <RadioGroup
                    name="ipv6mode"
                    value={props.data.rowData.ipv6mode}
                  >
                    {props.data.rowData.ipv6mode === "ipv6NoAddress" ? (
                      <FormControlLabel
                        name="ipv6mode"
                        value="ipv6NoAddress"
                        control={<Radio />}
                        label="No IPv6 Address"
                      />
                    ) : null}
                    {props.data.rowData.ipv6mode === "ipv6Dhcp" ? (
                      <FormControlLabel
                        name="ipv6mode"
                        value="ipv6Dhcp"
                        control={<Radio />}
                        label="DHCP"
                      />
                    ) : null}
                    {props.data.rowData.ipv6mode === "ipv6Static" ? (
                      <FormControlLabel
                        name="ipv6mode"
                        value="ipv6Static"
                        control={<Radio />}
                        label="Static"
                      />
                    ) : null}
                  </RadioGroup>
                </FormControl>
              </Grid>
              {props.data.rowData.ipv6mode === "ipv6Static" ? (
                <Grid item xs={2} md={2} sm={12}>
                  <TextField
                    id="outlined-multiline-static"
                    label="IP Address"
                    defaultValue={props.data.rowData.ipv6IpAddress}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
              ) : null}
              {props.data.rowData.ipv6mode === "ipv6Static" ? (
                <Grid item xs={2} md={2} sm={12}>
                  <TextField
                    id="outlined-multiline-static"
                    label="Prefix Length"
                    defaultValue={props.data.rowData.ipv6Prefix}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
              ) : null}
              {props.data.rowData.ipv6mode === "ipv6Static" ? (
                <Grid item xs={2} md={2} sm={12}>
                  <TextField
                    id="outlined-multiline-static"
                    label="Gateway IP"
                    defaultValue={props.data.rowData.ipv6Gateway}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
              ) : null}
              <Grid item xs={2} md={3} sm={12}>
                <TextField
                  id="outlined-multiline-static"
                  label="IPv6 DNS Server"
                  defaultValue={props.data.rowData.ipv6Dns}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={12} sm={12}>
                <span></span>
              </Grid>

              <Grid item xs={2} md={3} sm={12}>
                <FormControl
                  component="fieldset"
                  className={classes.formControl}
                >
                  <FormLabel component="legend"></FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={props.data.rowData.automaticConection}
                          name="automaticConection"
                        />
                      }
                      label="Connect Automatically"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={props.data.rowData.primaryConection}
                          name="primaryConection"
                        />
                      }
                      label="Primary Connection"
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </form>
    </div>
  );
}
