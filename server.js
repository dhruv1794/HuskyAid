const express = require('express');
const cookieParser = require('cookie-parser');
const sessions = require('./backend/sessions');
const helper = require('./backend/helper');
const services = require('./backend/services')
const app = express();
const PORT = 8080;

app.use(express.static('./frontend/build'));
app.use(express.json()); 
app.use(cookieParser());

app.get('/', (req, res) => {
    res.redirect('/');
});

const isAuth = (req) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';
    if(!sid || !username) {
      return {error: 'auth-missing', isAuthenticated:false }
    }
    return {error:null, isAuthenticated:true};
}

// check auth
app.get('/api/session', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';
    if(!sid || !username) {
      res.status(401).json({ error: 'auth-missing' });
      return;
    }
    const user = services.getUserFromUsername(username);
    res.json(user);
});

// login
app.put('/api/session', (req, res) => {
    const { username } = req.body;
    if(!helper.isValidUsername(username)) {
      res.status(400).json({ error: 'required-username' });
      return;
    }
    if(username === 'dog') {
      res.status(403).json({ error: 'auth-insufficient' });
      return;
    }
    const sid = sessions.addSession(username);
    res.cookie('sid', sid);
    const user = services.getUserFromUsername(username);
    if(!user.username) {
        services.addUser(username,sid);
    }
    res.json({ username });
});

// logout

app.delete('/api/session', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';
    if(sid) {
      res.clearCookie('sid');
    }
    if(username) {
      sessions.deleteSession(sid);
      services.removeUser(username);
    }
    res.json({ wasLoggedIn: !!username }); 
  });


app.get('/api/messages', (req,res)=>{
    const {error, isAuthenticated} = isAuth(req);
    if(!isAuthenticated) {
        res.status(401).json({ error });
        return;
    }
    const messages = services.getMessages();
    res.json({messages})
});

app.post('/api/messages', (req,res)=>{
    const {error, isAuthenticated} = isAuth(req);
    if(!isAuthenticated) {
        res.status(401).json({ error });
        return;
    }
    const username = req.cookies.sid ? sessions.getSessionUser(req.cookies.sid) : '';
    const messageAdded = services.addMessage(req.body);
    if(!messageAdded) {
        res.status(500).json({ error: 'There was a problem with sending a message' });
        return;
    }
    res.json({error:null, status:'success'});
});




app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));


