import React from "react";
import { ListItem, ListItemIcon, ListItemText, List } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import FlagIcon from "@material-ui/icons/Flag";
import AssignmentIcon from "@material-ui/icons/Assignment";
import CardGiftcardIcon from "@material-ui/icons/CardGiftcard";
import HomeIcon from "@material-ui/icons/Home";
import { Link, LinkProps } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    itemIcon: {
      width: "56px",
    },
  })
);

const links = [
  { title: "Home", link: "/", icon: <HomeIcon /> },
  { title: "Entries", link: "/entries", icon: <AssignmentIcon /> },
  { title: "Winner", link: "/winners", icon: <FlagIcon /> },
  { title: "Prizes", link: "/prizes", icon: <CardGiftcardIcon /> },
];

const AdapterLink = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
  <Link innerRef={ref as any} {...props} />
));

export default function DrawerItems() {
  const classes = useStyles();
  return (
    <>
      <List>
        {links.map((item: any, key) => (
          <ListItem button key={key} component={AdapterLink} to={item.link}>
            <ListItemIcon className={classes.itemIcon}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>
    </>
  );
}
