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
  { title: "ID", field: "id", defaultSort: "desc", editable: "never" },
  { title: "Name", field: "name" },
  {
    title: "Frequency",
    field: "frequency",
    lookup: {
      Daily: "Daily",
      Weekly: "Weekly",
      Monthly: "Monthly",
      Yearly: "Yearly",
    },
  },
  { title: "Number Of Winners Per Draw", field: "numOfWinnersPerDraw", type: "numeric" },
];

export default function Prizes() {
  const tableRef: any = useRef();

  return (
    <>
      <MaterialTable
        title="Prize List"
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
            let url = `prizes/paginate`;
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
