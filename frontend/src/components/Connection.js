import MaterialTable from "@material-table/core";
import React, { forwardRef, useReducer } from "react";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import Grid from "@material-ui/core/Grid";
import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useHistory, BrowserRouter as Router, Route } from "react-router-dom";
import DetailConnection from "./DetailConnection";
import Refresh from "@material-ui/icons/Refresh";
import Add from "@material-ui/icons/Add";
import Checkbox from "@material-ui/core/Checkbox";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

export default function Connection() {
  const columns = [
    { title: "Id", field: "id" },

    { title: "Name", field: "name" },
    { title: "Type", field: "type" },
    { title: "Interface", field: "ninterface" },

    { title: "IPv4 DNS Server", field: "ipv4Dns" },

    { title: "IPv6 DNS Server", field: "ipv6Dns" },

    {
      title: "Primary Connection",
      field: "primaryConection",
      render: (rowData) => (
        <Checkbox
          checked={rowData.primaryConection}
          name="primaryConection"
          color="primary"
        />
      ),
    },
    {
      title: "Connect automatically",
      field: "automaticConection",
      render: (rowData) => (
        <Checkbox
          checked={rowData.automaticConection}
          name="automaticConection"
          color="primary"
        />
      ),
    },
  ];
  const messageState = {
    errorMsg: "",
    successMsg: "",
  };

  const reducer = (state, action) => {
    const result = { ...state };
    result[action.type] = action.value;
    return result;
  };
  const [message, setMessages] = useReducer(reducer, messageState);
  const { errorMsg, successMsg } = message;

  const ConnectionDelete = (name) => {
    var data = {
      name: name,
    };
    fetch("http://127.0.0.1:8000/api/delete-connection", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.ok) {
        res.json().then((result) => {
          tableRef.current && tableRef.current.onQueryChange();
          setMessages({
            type: "successMsg",
            value: "Connection successfully deleted",
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

  const data = (query) =>
    new Promise((resolve, reject) => {
      let url = "http://127.0.0.1:8000/api/get-connections?";
      url += "per_page=" + query.pageSize;
      url += "&page=" + (query.page + 1);
      fetch(url)
        .then((response) => response.json())
        .then((result) => {
          resolve({
            data: result.data,
            page: result.page - 1,
            totalCount: result.total,
          });
        });
    });
  const tableRef = React.createRef();

  const history = useHistory();

  const UpdateConnection = (name) => {
    history.push(`/edit/::${name}`);
  };

  const routeChange = () => {
    history.push("/create");
  };

  return (
    <div className="App wrapper">
      <Router>
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
        <MaterialTable
          title="Connections"
          tableRef={tableRef}
          icons={tableIcons}
          columns={columns}
          data={data}
          options={{
            actionsColumnIndex: -1,
          }}
          detailPanel={(rowData) => {
            return (
              <div>
                <DetailConnection data={rowData} />
              </div>
            );
          }}
          actions={[
            {
              icon: Add,
              tooltip: "Add User",
              isFreeAction: true,
              onClick: () => routeChange(),
            },
            {
              icon: Refresh,
              tooltip: "Refresh Data",
              isFreeAction: true,
              onClick: () =>
                tableRef.current && tableRef.current.onQueryChange(),
            },
            {
              icon: Edit,
              tooltip: "Edit Connection",
              onClick: (event, rowData) => UpdateConnection(rowData.name),
            },
          ]}
          editable={{
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  ConnectionDelete(oldData.name);
                  resolve();
                }, 1000);
              }),
          }}
        />
      </Router>
    </div>
  );
}
