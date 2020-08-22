import React, { useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useFormik } from "formik";
import { red } from "@material-ui/core/colors";
import { useHistory } from "react-router";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { api } from "../../utils/api";
import { setAccess, getAccess } from "../../utils/localStorage";
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://www.rfc.com.ph/">
        Radio Wealth Finance
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: "#f5f5f5",
    width: "100%",
    height: "100%",
  },
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
    margin: theme.spacing(3, 0, 2),
  },
  username: {
    marginTop: 8,
  },
  invalidEror: {
    color: red.A700,
  },
}));

export default function Login() {
  const classes = useStyles();
  let history = useHistory();

  const [state, setstate] = useState({
    isErrorShow: false,
    isErrorMessage: "",
  });
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      //   alert(JSON.stringify(values, null, 2));
      api
        .post("auth", values)
        .then((res: any) => {
          console.log(res.data.access_token);
          setAccess(res.data);
          history.push("/");
        })
        .catch((error: any) => {
          if (error.response.status === 401) {
            console.log(error.response.data);
            setstate({
              isErrorShow: true,
              isErrorMessage: error.response.data,
            });
          }
        });
    },
  });

  return (
    <div className={classes.container}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>

          <form className={classes.form} action={""} onSubmit={formik.handleSubmit}>
            <Grid container>
              <Grid item>
                <Typography className={classes.invalidEror} variant="caption" display="block">
                  {state.isErrorShow ? `* ${state.isErrorMessage}` : null}
                </Typography>
              </Grid>
            </Grid>
            <TextField
              className={classes.username}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="Username"
              label="Username"
              autoFocus
              name="username"
              onChange={formik.handleChange}
              value={formik.values.username}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />

            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
              Sign In
            </Button>
          </form>
        </div>
        <Box mt={2}>
          <Copyright />
        </Box>
      </Container>
    </div>
  );
}
