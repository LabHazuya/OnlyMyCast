//react
import React, { useState, useRef, useEffect } from 'react'
import { Link as RLink } from 'react-router-dom';
//ui
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Link from '@material-ui/core/Link';
import EditIcon from '@material-ui/icons/Edit';
import AssessmentIcon from '@material-ui/icons/Assessment';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import SwipeableViews from 'react-swipeable-views';
//customUI
import TabPanel from '../CustomComponent/TabPanel';
//firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database"
//other
import { Helmet } from 'react-helmet';

const useStyles = makeStyles((theme)=>({
    root: {
        minWidth: 275,
        marginTop: 100,
        borderRadius: "10px",
        alignItems:"center",
        textAlign:"center"
    },
    appBar: {
        top: 'auto',
        bottom: 0,
        alignItems:"center"
    },
    menuButton: {
        margin: theme.spacing(1),
    },
    margin: {
        marginBottom: theme.spacing(2),
        marginTop:theme.spacing(2)
      },
    tabBar: {
        marginBottom: 10,
        boxShadow : "none",
    },
  }));


const EditPodcast = (props) => {

    const classes = useStyles();
    const [spList, setSpList] = useState();
    const [castdarftSpList, setCastdarftSpList] = useState();
    const isFirstLoad = useRef(true);
    const theme = useTheme();

    const [tabValue, setTabValue] = useState(0);

    useEffect(
        ()=>{
            if (isFirstLoad.current) {
                if (props.user.userId !== "") {
                    getPodcastList();
                    getCastdarftList();
                }
                window.scrollTo(0, 0);
                isFirstLoad.current = false;
            }
        }
    )

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
      };
    
    const handleChangeIndex = (index) => {
        setTabValue(index);
    };

    const toDataTime = (sec) => {
        var t = new Date(Date.UTC(1970, 0, 1, 0, 0, 0))
        t.setUTCSeconds(sec);
        return t.toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'},);
      }

    // ???????????????
    const getPodcastList = () => {
        var changeArr = Array();
        firebase.firestore()
        .collection("podcast")
        .doc(props.user.userId)
        .collection('podcast')
        .orderBy('updateTime', 'desc')
        .get()
        .then(async(e)=>{
            if (e.docs.length === 0) {
                setSpList("");
            } else {
                for (var doc of e.docs) {
                    const data = doc.data();
                    changeArr.push(
                        <>
                        <ListItem button component={RLink} to={"/podcastdetail/"+ props.user.userId + "/" + doc.id} key={doc.id}>
                            <ListItemText>
                                <Link style={{ display:"-webkit-box", overflow:"hidden", whiteSpace: "normal", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }} variant="body1" underline="none">{data.title}</Link>
                                <Typography variant="body2" component="span">????????? {toDataTime(data.updateTime.seconds)}</Typography>
                            </ListItemText>
                            <Tooltip title="????????????">
                                <ListItemIcon>
                                    <IconButton 
                                    aria-label="play"
                                    value={doc.id}
                                    component={RLink}
                                    to={"/analyticspodcast/"+ props.user.userId + "/" + doc.id}
                                    >
                                        <AssessmentIcon/>
                                    </IconButton>
                                </ListItemIcon>
                            </Tooltip>
                            <Tooltip title="????????????">
                                <ListItemIcon>
                                    <IconButton 
                                    aria-label="play"
                                    value={doc.id}
                                    component={RLink}
                                    to={"/editpodcast/"+ props.user.userId + "/" + doc.id}
                                    >
                                        <EditIcon/>
                                    </IconButton>
                                </ListItemIcon>
                            </Tooltip>
                        </ListItem>
                        <Divider/>
                        </>
                    )
                }  
            }
        }).then(()=>{
            setSpList(changeArr);
        })
    }

    // ??????
    const getCastdarftList = () => {
        var changeArr = Array();
        firebase.firestore()
        .collection("podcast")
        .doc(props.user.userId)
        .collection('castdarft')
        .orderBy('updateTime', 'desc')
        .get()
        .then(async(e)=>{
            if (e.docs.length === 0) {
                setCastdarftSpList('');
            } else {
                for (var doc of e.docs) {
                    const data = doc.data();
                    changeArr.push(
                        <>
                        <ListItem button component={RLink} key={doc.id}>
                            <ListItemText>
                                <Link style={{ display:"-webkit-box", overflow:"hidden", whiteSpace: "normal", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }} variant="body1" underline="none">{data.title}</Link>
                                <Typography variant="body2" component="span">????????? {toDataTime(data.updateTime.seconds)}</Typography>
                            </ListItemText>
                            <Tooltip title="????????????">
                                <ListItemIcon>
                                    <IconButton 
                                    value={doc.id}
                                    component={RLink}
                                    to={"/editcastdarft/"+ props.user.userId + "/" + doc.id}
                                    >
                                        <EditIcon/>
                                    </IconButton>
                                </ListItemIcon>
                            </Tooltip>
                        </ListItem>
                        <Divider/>
                        </>
                    )
                }  
            }
        }).then(()=>{
            setCastdarftSpList(changeArr);
        })
    }

    if (props.user.userId==="") {
        return(
            <Container maxWidth="md">
                <Card className={classes.root}>
                    <CardContent>
                        <Typography variant="h2" component="h1" gutterBottom>
                            (^???^)???<br/>
                        </Typography>
                        <Typography variant="h5" component="span">
                            ???<br/>???????????????????????? ???(?????????)???<br/>                            
                        </Typography>
                        <br/>
                        <Button
                            component={RLink}
                            to="/podcastaccount"
                            color="primary"
                            fullWidth
                            size="large"
                            variant="contained"
                            >              
                            ????????????????????????????????????
                            </Button>
                    </CardContent>
                </Card>
            </Container>
        )} else {
            if (spList === undefined || castdarftSpList === undefined) {
                return(<CircularProgress style={{marginTop: "25%"}} />);
            } else {
                return(
                    <Container maxWidth="md">
                        <Helmet>
                            <title>???????????? - Onlymycast</title>
                        </Helmet>
                        <Card className={classes.root}>
                            <CardContent>
                            <Typography variant="h5" component="h1">????????????</Typography><br/>
                            <Typography variant="body1" component="span">????????????????????????????????????????????????????????????</Typography>
                            <br/>
                            <br/>
                            <Divider/>
                            <AppBar className={classes.tabBar} position="static" color="default">
                                <Tabs
                                value={tabValue}
                                onChange={handleChange}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="fullWidth" >
                                    <Tab label="?????????" />
                                    <Tab label="?????????" />
                                </Tabs>
                            </AppBar>
                            <SwipeableViews
                                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                                index={tabValue}
                                onChangeIndex={handleChangeIndex}>
                                <TabPanel value={tabValue} index={0}>
                                    {spList==="" || spList.length===0 ? 
                                    <Button
                                    component={RLink}
                                    to="/uploadpodcast"
                                    color="primary"
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                    >              
                                    ??????????????????
                                    </Button>
                                    :
                                    spList
                                    }
                                </TabPanel>
                                <TabPanel value={tabValue} index={1}>
                                    {castdarftSpList==="" || castdarftSpList.length===0 ? 
                                    <Typography variant='body1'>????????????????????????</Typography>
                                    :
                                    castdarftSpList
                                    }
                                </TabPanel>
                            </SwipeableViews>
                            </CardContent>
                        </Card>
                    </Container>
                );
            }
        }
}
export default EditPodcast;