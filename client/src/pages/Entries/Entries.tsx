import React, { useRef, useState, forwardRef, useEffect } from "react";
import MaterialTable, { Column } from "material-table";
import api from "../../utils/api";
import { makeStyles, Select, TextField } from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";

import Autocomplete from "@material-ui/lab/Autocomplete";

interface Row {
  id: number;
  accountNumber: number;
  region: string;
  branch: string;
  name: string;
  ammountPaid: number;
  paymentFacility: string;
  dateOfPayment: string;
  mobileNumber: number;
  entryCode: string;
  isValid: boolean;
  createdAt: string;
}

interface branchType {
  region: string;
  branch: string;
}
const useStyles = makeStyles({
  addButton: {
    //  add button on top
    "& div.MuiToolbar-root > div > div > div > span  ": {
      margin: 20,
    },
    " & div.MuiToolbar-root > div > div > div > span > button ": {
      padding: "0px",
      width: "20px",
      height: "20px",
    },
    // on edit and delete, also for accept and cancel
    "& tbody > tr > td:nth-child(1)  > div > button": {
      padding: "0px",
      width: "20px",
      height: "20px",
      margin: 12,
    },
  },
  option: {
    fontSize: 15,
    "& > span": {
      marginRight: 10,
      fontSize: 8,
    },
  },
});

export default function Entries() {
  const classes = useStyles();
  const tableRef: any = useRef();
  const [isEdit, setIsEdit] = useState(false);
  const [branches, setbranches] = useState([]);
  const [state, setstate] = useState<Array<Column<Row>>>([
    {
      title: "Entry ID",
      field: "id",
      defaultSort: "desc",
      editable: "never",
      width: "5%",
    },
    { title: "Account Number", field: "accountNumber", type: "numeric" },
    {
      title: "Region",
      field: "region",
    },
    {
      title: "Branch",
      field: "branch",
    },
    { title: "Name", field: "name" },
    { title: "Mobile Number", field: "mobileNumber", type: "numeric" },
    {
      title: "Ammount Paid",
      field: "ammountPaid",
      type: "currency",
      currencySetting: { currencyCode: "PHP" },
    },

    { title: "Payment Facility", field: "paymentFacility" },
    { title: "Date Of Payment", field: "dateOfPayment", type: "date" },
    {
      title: "Number Of Entries",
      field: "numberOfEntries",
      type: "numeric",
      editable: "onAdd",
      hidden: true,
      width: "8%",
    },

    {
      title: "Entry Code",
      field: "entryCode",
      editable: "never",
      hidden: false,
    },
    {
      title: "Valid",
      field: "isValid",
      type: "boolean",
      editable: "never",
      hidden: false,
    },
    {
      title: "Created At",
      field: "createdAt",
      editable: "never",
      type: "date",
      hidden: false,
    },
  ]);

  useEffect(() => {
    const fetchBranchesLookUp = async () => {
      const branches: any = await api.get(`branches`);
      setbranches(branches);
      setstate((prevState: any) => {
        const data = [...prevState];
        //branch
        data[3].editComponent = (tableData: any) => {
          return (
            <Autocomplete
              id="controllable-states-demo"
              classes={{
                option: classes.option,
              }}
              options={branches}
              getOptionLabel={(option: any) => option.branch}
              groupBy={(option) => option.region}
              style={{ width: "200px" }}
              defaultValue={branches.find((item: any) => item.branch === tableData.value)}
              inputValue={tableData.value}
              onInputChange={(event, newInputValue: any, reason: any) => {
                tableData.onChange(newInputValue);
              }}
              renderOption={(option: branchType) => (
                <>
                  <span>{option.region}</span>
                  {option.branch}
                </>
              )}
              renderInput={(params) => <TextField {...params} variant="standard" />}
            />
          );
        };
        return data;
      });
    };
    fetchBranchesLookUp();
  }, []);
  const handleAddButton = () => {
    setstate((prevState: any) => {
      const data = [...prevState];
      data.forEach((element) => {
        element.cellStyle = { whiteSpace: "nowrap" };
      });
      data[2].hidden = !data[2].hidden;
      data[9].hidden = !data[9].hidden;
      data[10].hidden = !data[10].hidden;
      data[11].hidden = !data[11].hidden;
      data[12].hidden = !data[12].hidden;
      return data;
    });
  };
  const handleEdit = async () => {
    await setIsEdit(true);
    await setstate((prevState: any) => {
      const data = [...prevState];
      data[2].hidden = !data[2].hidden;
      data[9].hidden = !data[9].hidden;
      data[10].hidden = !data[10].hidden;
      data[11].hidden = !data[11].hidden;
      data[12].hidden = !data[12].hidden;
      return data;
    });
    console.log(isEdit);
  };
  return (
    <div className={classes.addButton}>
      <MaterialTable
        title="Entry List"
        tableRef={tableRef}
        columns={state}
        icons={{
          Add: forwardRef((props, ref) => <AddBoxIcon onClick={(e) => handleAddButton()} />),
          // Check: forwardRef((props, ref) => <CheckIcon onClick={(e) => handleAddButton()} />),
          Clear: forwardRef((props, ref) => <CloseIcon onClick={(e) => handleAddButton()} />),
          Edit: forwardRef((props, ref) => <EditIcon onClick={(e) => handleAddButton()} />),
        }}
        options={{
          maxBodyHeight: "auto",
          minBodyHeight: "auto",
          addRowPosition: "first",
          loadingType: "overlay",
          pageSize: 5,
          pageSizeOptions: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
          sorting: false,
          grouping: true,
          exportAllData: true,
          exportButton: true,
        }}
        data={(query: any) =>
          new Promise(async (resolve, reject) => {
            let url = `entries/paginate`;
            url += "?page=" + (query.page + 1);
            url += "&limit=" + query.pageSize;
            url += "&search=" + query.search;
            const result: any = await api.get(url);
            console.log(result);
            resolve({
              data: result.data,
              page: result.page - 1,
              totalCount: result.total,
            });
          })
        }
        editable={{
          onRowAdd: (newData: Row) =>
            new Promise(async (resolve, reject) => {
              try {
                const regionfinder: any = branches.find((item: branchType) => item.branch === newData.branch);
                newData.region = regionfinder!.region;
                newData.isValid = true;
                newData.ammountPaid = Number(newData.ammountPaid);
                await api.post("entries", newData);
                tableRef.current.onQueryChange();
                resolve();
                handleAddButton();
              } catch (error) {
                console.log(error);
                reject();
              }
            }),
          onRowUpdate: (newData: any, oldData: any) =>
            new Promise(async (resolve, reject) => {
              try {
                const regionfinder: any = branches.find((item: branchType) => item.branch === newData.branch);
                newData.region = regionfinder!.region;
                newData.numberOfEntries = 0;
                newData.ammountPaid = Number(newData.ammountPaid);
                await api.put(`entry/${newData.id}`, newData);
                tableRef.current.onQueryChange();
                handleAddButton();
                resolve();
              } catch (error) {
                console.log(error);
                reject();
              }
            }),
          onRowDelete: (oldData: any) =>
            new Promise(async (resolve, reject) => {
              try {
                await api.delete(`entry/${oldData.id}`);
                tableRef.current.onQueryChange();
                resolve();
              } catch (error) {
                reject();
              }
            }),
        }}
      />
    </div>
  );
}
