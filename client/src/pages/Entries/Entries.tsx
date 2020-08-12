import React, { useRef } from "react";
import MaterialTable, { Column } from "material-table";
import api from "../../utils/api";

interface Row {
  id: number;
  region: string;
  name: string;
  mobileNumber: number;
  isValid: boolean;
}

const column: Array<Column<Row>> = [
  { title: "Entry ID", field: "id", defaultSort: "desc", editable: "never" },
  {
    title: "Region",
    field: "region",
    lookup: {
      NLR: "NLR",
      SLR: "SLR",
      VIS: "VIS",
      NMR: "NMR",
      EMR: "EMR",
      SMR: "SMR",
    },
  },
  { title: "Name", field: "name" },
  { title: "Mobile Number", field: "mobileNumber", type: "numeric" },
  { title: "Valid", field: "isValid", type: "boolean", editable: "onAdd" },
];

export default function Entries() {
  const tableRef: any = useRef();

  return (
    <>
      <MaterialTable
        title="Entry List"
        tableRef={tableRef}
        columns={column}
        options={{
          maxBodyHeight: "100%",
          addRowPosition: "first",
          loadingType: "overlay",
          pageSize: 5,
          pageSizeOptions: [5, 10, 15, 20, 25],
          sorting: false,
          grouping: true,
        }}
        data={(query: any) =>
          new Promise(async (resolve, reject) => {
            let url = `entries/paginate`;
            url += "?page=" + (query.page + 1);
            url += "&limit=" + query.pageSize;
            url += "&search=" + query.search;
            const result: any = await api.get(url);
            resolve({
              data: result.data,
              page: result.page - 1,
              totalCount: result.total,
            });
          })
        }
        editable={{
          onRowAdd: (newData: any) =>
            new Promise(async (resolve, reject) => {
              try {
                await api.post("entries", newData);
                tableRef.current.onQueryChange();
                resolve();
              } catch (error) {
                reject();
              }
            }),
          onRowUpdate: (newData: any, oldData: any) =>
            new Promise(async (resolve, reject) => {
              try {
                await api.put(`entry/${newData.id}`, newData);
                tableRef.current.onQueryChange();
                resolve();
              } catch (error) {
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
    </>
  );
}
