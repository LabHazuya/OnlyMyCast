import logo from './logo.svg';
import './App.css';
import { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import Home from './Component/Home/Home'
import Account from './Component/Account/Account'
import Player from './Component/Player/Player'
import Navbar from './Component/NavBar/Navbar';
import PodcastAccount from './Component/Account/PodcastAccount';
import Subreq from './Component/Account/Subreq';
import Search from './Component/Search/Search'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import PodcastHome from './Component/Podcast/PodcastHome';
import NewPodcast from './Component/Podcast/NewPodcast'
import PodcastDetails from './Component/Podcast/PodcastDetails'
import EditPodcast from './Component/Podcast/EditPodcast'
import EditPodcastDetails from './Component/Podcast/EditPodcastDetails';
import SignIn from './Component/SignIn/SignIn';
import SignUp from './Component/SignUp/SignUp';
/*UI*/
import LinearProgress from '@material-ui/core/LinearProgress';
import FirebaseConfig from './FirebaseConfig/FirebaseConfig';

const App = () => {

  const isFirstLoad = useRef(true);
  const [isAuth, setAuth] = useState(0);
  const [playerUrl, setPlayerUrl] = useState();
  const [playerTitle, setPlayerTitle] = useState("");
  const [podcastName, setPodcastName] = useState("");
  const [coverUri, setCoverUri] = useState("");
  const [userData, setUserData] = useState("");
  const [userUpdate, setUserUpdate] = useState(0);
  const [reqCount, setReqCount] = useState("");
  const userUid = useRef();

  var basename = "/";
  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseConfig);  
  }

  if (process.env.NODE_ENV !== "development") {
    if (isFirstLoad.current) {
      //const appCheck = firebase.appCheck();
      //appCheck.activate('6Lfs9TQbAAAAANxrKWGaZgx71yy6PHZ26t5CGE4h');
    }
    basename = "/apps/one-sen-day/"
  }

  document.body.style.backgroundColor = "#f7f7f7";

  const handleUserUpdate = ()=>{
    setUserUpdate(userUpdate + 1);
  }

  useEffect(
    () => {
      firebase.auth().onAuthStateChanged((user)=>{
        if (user) {
          firebase.firestore().collection("user").doc(user.uid).get()
          .then(
            (doc)=>{
              setUserData(doc.data());
              userUid.current = user.uid;
              setAuth(true);
            }
          );
        } else {
          setAuth(false);
        }
      });
    },[userUpdate]
  )

 
  useEffect(
    ()=>{
      getReqCount();
    }
  )
  

  const setPlayer = (e) => {
    console.log(e.currentTarget.dataset.titlename);
    setPlayerTitle(e.currentTarget.dataset.titlename)
    setPlayerUrl(e.currentTarget.dataset.uri)
    setPodcastName(e.currentTarget.dataset.podcastname)
    setCoverUri(e.currentTarget.dataset.coveruri)
  }

  const getReqCount = ()=>{
    firebase.database().ref('/subcheck/' + userData.userId).once("value", e => {
    }).then((e)=>{
      if (e.val() !== null) {
        setReqCount(Object.entries(e.val()).length);
      } else {
        setReqCount(0);
      }
    })
  }
  

  const theme = createMuiTheme({
    palette: {
    primary: {
        main: "#ff9800",
    },
    secondary: {
        main: "#ff3d00",
    },
    white:{
        main: "#00000"
    }
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <BrowserRouter basename={ basename }>
          <Player url={playerUrl} podcastName={podcastName} singleName={playerTitle} coverUrl={coverUri}>
            { isAuth !== 0 ?  
                <>
                  <Route exact path="/" 
                    render={(props) => (
                        <Home {...props} user={userData} userUid={userUid.current} />
                      )}/>
                  <Route exact path="/account"
                    render={(props) => (
                        <Account {...props} user={userData} dataupdate={handleUserUpdate} userUid={userUid.current} />
                      )}
                  />
                  <Route exact path="/podcastaccount" 
                    render={(props) => (
                        <PodcastAccount {...props} user={userData} userUid={userUid.current}/>
                      )}/>
                  <Route exact path="/subreq" 
                    render={(props) => (
                        <Subreq {...props} user={userData} userUid={userUid.current} callDataUpdate={getReqCount}/>
                      )} />
                  <Route exact path="/search" component={Search} />
                  <Route path="/search/:q" component={Search} />
                  <Route path="/podcastdetail/:id/:podId"                  
                    render={(props) => (
                        <PodcastDetails {...props} setPlayer={setPlayer} />
                      )} />
                  <Route path="/podcast/:id"
                    render={(props) => (
                        <PodcastHome {...props} setPlayer={setPlayer} user={userData} userUid={userUid.current} />
                      )} />
                  <Route exact path="/uploadpodcast"
                    render={(props) => (
                        <NewPodcast {...props} user={userData} userUid={userUid.current} />
                      )} />
                  <Route exact path="/editpodcasts" 
                    render={(props) => (
                        <EditPodcast {...props} user={userData} />
                      )} 
                  />
                  <Route path="/editpodcast/:id/:podId" 
                    render={(props) => (
                        <EditPodcastDetails {...props} user={userData} />
                      )} 
                  />
                  <Route exact path="/signin" component={SignIn} />
                  <Route exact path="/signup" component={SignUp} />
                  { isAuth ? "" : <Redirect to='/signin'/> }
                  { isAuth && <Navbar user={userData} reqCount={reqCount}></Navbar> }
                </>
                :
                <LinearProgress style={{ wdith: 100 }}/>
                }

          </Player>
        </BrowserRouter> 
      </div>
    </ThemeProvider>
  );
}
export default App;
