//react
import React from 'react';
/*google themes */
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
//static
import LogoIcon from '../../static/only-my-cast-icon.svg'


const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 1),
    // vertical padding + font size from searchIcon
  },
  appBar: {
    backgroundColor: "rgba(40, 40, 40, 0.85)",
    backdropFilter: "blur(4px)",
    boxShadow: "none",
 },
}));

const UnloginNavBar = (props) => {

    const classes = useStyles();
    return (
      <div>
          <AppBar className={classes.appBar} position="fixed">
          <Toolbar>
              <img alt="OnlyMyCast" src={LogoIcon} width="48" height="48" />
              <div className={classes.grow}/>
              <Typography variant="h6">建立、收聽私人Podcast</Typography>
              <div className={classes.grow}/>
                <Button href="../signin" size="medium" variant="contained" color="primary">
                    開始
                </Button>
          </Toolbar>
          </AppBar>

      </div>
    );
}
export default UnloginNavBar;
