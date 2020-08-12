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
  { title: "Entry ID", field: "entryID" },
  { title: "Prize ID", field: "prizeID" },
  { title: "Prize Name", field: "prizeName" },
  { title: "Date", field: "createdAt" },
];

export default function Winners() {
  const tableRef: any = useRef();

  return (
    <>
      <MaterialTable
        title="Winners List"
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
            let url = `winners/paginate`;
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
      />
    </>
  );
}
