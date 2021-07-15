//react
import React, { useState, useEffect } from 'react';
import { Link as RLink } from 'react-router-dom';
//firebase
import firebase from "firebase/app";
import "firebase/auth";
/*google themes */
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { fade, makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import Drawer from '@material-ui/core/Drawer';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange } from '@material-ui/core/colors';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PublishIcon from '@material-ui/icons/Publish';
import EditIcon from '@material-ui/icons/Edit';
import Badge from '@material-ui/core/Badge';
import Link from '@material-ui/core/Link';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import GraphicEqIcon from '@material-ui/icons/GraphicEq';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import FaceIcon from '@material-ui/icons/Face';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
//static
import LogoIcon from '../../static/only-my-cast-icon.svg'
import Logo from '../../static/only-my-cast.svg'

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    margin: 0,
    width: 'auto',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 1),
    // vertical padding + font size from searchIcon
  }, 
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
}));

const NavBar = (props) => {

    const classes = useStyles();
    const [sideBar, setSideBar] = useState(false);
    const [reqCount, setReqCount] = useState("");
    const handleLogout = ()=>{
      firebase.auth().signOut().then(() => {
        // Sign-out successful.
        window.location.reload();
      }).catch((error) => {
        // An error happened.
      });
    }

    useEffect(
      ()=>{
        getReqCount();
      }
    )

    const getReqCount = ()=>{
      firebase.database().ref('/subcheck/' + props.user.userId).once("value", e => {
      }).then((e)=>{
        if (e.val() !== null) {
          setReqCount(Object.entries(e.val()).length);
        } else {
          setReqCount(0);
        }
      })
    }

    return (
      <div>
          <AppBar color="secondary" position="fixed">
          <Toolbar>
            { reqCount > 0 ?
                <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="open drawer"
                onClick={ ()=>{ setSideBar(true) } }>
                <Badge
                  color="primary" variant="dot"
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}><MenuIcon />
                </Badge>
                </IconButton>            
              
            :
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
              onClick={ ()=>{ setSideBar(true) } }>
                  <MenuIcon />
              </IconButton>
            }
              <Link component={RLink} to="/" >
                <img alt="OnlyMyCast" src={LogoIcon} width="48" height="48" />
              </Link>
              <Typography variant="body2">OnlyMyCast</Typography>
              <div className={classes.grow}/>
              <Fab component={RLink} to="/uploadpodcast" color="primary" aria-label="add" size="small" className={classes.menuButton} edge="end" >
                    <AddIcon />
              </Fab>
              <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="searching"
                  component={RLink} 
                  to="/search"
                  >
                  <SearchIcon />
                  </IconButton>
          </Toolbar>
          </AppBar>

          <Drawer anchor="left" open={ sideBar } onClose={ ()=> setSideBar(false) }>
              <div className={ classes.list } 
                  role="presentation"
                  onClick={ ()=>{ setSideBar(false) } }
                  onKeyDown={ ()=>{ setSideBar(false) } }>
                  <List>
                      <ListItem key="account">
                          <ListItemIcon><Avatar alt={props.user.name} src={props.user.avatar==="" ? "." : props.user.avatar} className={ classes.orange } /></ListItemIcon>
                          <Typography variant="body2" component="span">
                            {props.user.name}
                            <br/>
                            <Typography variant="caption" component="span">{props.userEmail}</Typography>
                          </Typography>
                      </ListItem>
                      <ListItem key="accountedit">
                      <ButtonGroup size="large" orientation="vertical" aria-label="outlined primary button group" fullWidth>
                        <Button key="accoutsetting" component={RLink} to="/account" variant="outlined"><AccountBoxIcon />個人管理</Button>
                        <Button key="logout" onClick={handleLogout} variant="outlined"><ExitToAppIcon />登出</Button>
                      </ButtonGroup>
                      </ListItem>
                  </List>
                  <Divider />
                  <List>
                  <ListItem button component={RLink} to="/podcastaccount" key="podcastsetting">
                          <ListItemIcon><GraphicEqIcon /></ListItemIcon>
                          <ListItemText primary="電台設定"></ListItemText>
                      </ListItem>
                      <ListItem button component={RLink} to="/uploadpodcast" key="publish">
                          <ListItemIcon><PublishIcon /></ListItemIcon>
                          <ListItemText primary="單集發佈"></ListItemText>
                      </ListItem>
                      <ListItem button component={RLink} to="/editpodcasts" key="editpod">
                          <ListItemIcon><EditIcon /></ListItemIcon>
                          <ListItemText primary="單集管理"></ListItemText>
                      </ListItem>
                  </List>
                  <Divider />
                  <List>
                  <ListItem button component={RLink} to="/subreq" key="subreq">
                          <ListItemIcon>
                              <Badge badgeContent={reqCount} color="primary">
                                  <InboxIcon />
                              </Badge>
                          </ListItemIcon>
                          <ListItemText primary="追蹤請求"></ListItemText>
                      </ListItem>
                    <ListItem button component={RLink} to="/fansadmin" key="fansadmin">
                          <ListItemIcon>
                            <FaceIcon />
                          </ListItemIcon>
                          <ListItemText primary="追蹤管理"></ListItemText>
                      </ListItem>
                  </List>
                  <Divider />
                  <List>
                    <ListItem button component={RLink} to="/podcast/onlymycast" key="offical">
                            <ListItemIcon>
                                    <QuestionAnswerIcon />
                            </ListItemIcon>
                            <ListItemText primary="官方頻道"></ListItemText>
                    </ListItem>
                  </List>
                  <Divider />
                  <List alignItems="center">
                      <ListItem key="privatepolic" fontSize={5}>
                          <Link target="_blank" href="https://www.notes-hz.com/page/privacypolicy" variant="body2">隱私權</Link>
                          &nbsp;
                          <Link target="_blank" href="https://www.notes-hz.com/page/serviceRules" variant="body2">條款</Link>
                          &nbsp;
                          <Link target="_blank" href="https://www.notes-hz.com/page/readerService" variant="body2">聯繫</Link>
                      </ListItem>
                      <ListItem key="copyright" fontSize={5}>
                        <Typography variant="body2" color="textSecondary">
                          {'Copyright © ' + new Date().getFullYear()}<br/>OnlyMyCast建立私人PodCast<br/>
                          <Link href="https://lab.notes-hz.com/">
                            <span style={ {fontSize: "24px", color: "#028ff3", fontWeight: "bold"} }>Lab</span>
                            <span style={ {fontSize: "24px", color: "#FD3E49", fontWeight: "bold"} }>H</span>
                            <span style={ {fontSize: "24px", color: "#FF8738", fontWeight: "bold"} }>a</span>
                            <span style={ {fontSize: "24px", color: "#FFA900", fontWeight: "bold"} }>z</span>
                            <span style={ {fontSize: "24px", color: "#00A752", fontWeight: "bold"} }>u</span>
                            <span style={ {fontSize: "24px", color: "#007BEE", fontWeight: "bold"} }>y</span>
                            <span style={ {fontSize: "24px", color: "#9B49DF", fontWeight: "bold"} }>a</span>
                            </Link><br/>
                            <Link href="https://www.notes-hz.com/">筆記長也NotesHazuya</Link>
                            <br/><br/>
                        </Typography>
                      </ListItem>

                  </List>
              </div>
          </Drawer>
      </div>
    );
}
export default NavBar;
