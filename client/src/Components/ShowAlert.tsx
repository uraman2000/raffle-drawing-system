import React, { useState, useEffect } from "react";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { Snackbar } from "@material-ui/core";

const CMuiAlert = (props: any) => <MuiAlert elevation={6} variant="filled" {...props} />;

export default function ShowAlert(props: any) {
  const { isOpen, message } = props;
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(!open);
  }, [open]);

  const handleClose = (event?: React.SyntheticEvent) => {
    setOpen(!open);
  };

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={(e) => handleClose(e)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <CMuiAlert severity="error" onClose={(e: any) => handleClose(e)}>
          {message}
        </CMuiAlert>
      </Snackbar>
    </div>
  );
}
