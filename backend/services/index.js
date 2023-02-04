let messages = [];
let users = [];


function getMessages() {
    return messages;
}

function getUsers () {
    return users;
}

function getOtherUsers (userid){
    return users.filter((user)=>{
        if(user.id !== userid) {
            return user;
        }
    })
}

function getUserFromCookie (cookie) {
    return users.filter((user)=>{
        if(user.cookie !== cookie) {
            return user;
        }
    })
}

function setMessages (msgs){
    messages = msgs;
}

function setUsers  (usrs) {
    users = usrs;
}

function removeUser(username) {
    const newUserList = users.filter((user)=>{
        if(user.username !== username) {
            return user;
        }
    });
    setUsers(newUserList);
}

function addMessage ({full_name, email, phone, message}) {
    let newMessage = {
        full_name,
        email,
        phone,
        message,
    }
    setMessages([...messages,newMessage]);
    return true;
} 

function addUser  (username, cookie){
    const newUser = {
        username,
        id:users.length+1,
        isOnline:true,
        cookie
    }
    setUsers([...users, newUser]);
}

function editUserStatus (userid, isOnline, cookie){
    let allUsers = [...users];
    let {user,index} = findUser(userid);
    if(!user || !index) return false;
    let userNew = allUsers[index];
    userNew.isOnline = isOnline;
    userNew.cookie = cookie;
    allUsers[index] = userNew;
    setUsers(allUsers);
    return true;
}

function findUser (userid)  {
    let userToBeFound = null;
    let index = null;
    for(let i = 0; i < users.length; i++) {
        if(userid === users[i].id) {
            userToBeFound = users[i];
            index = i;
            break;
        }
    }
    return {
        user:userToBeFound,
        index
    }
}

function getUserFromUsername(username) {
    let userToBeFound = null;
    let index = null;
    for(let i = 0; i < users.length; i++) {
        if(username === users[i].username) {
            userToBeFound = users[i];
            index = i;
            break;
        }
    }
    return {
        user:userToBeFound,
        index
    }
}

 

module.exports =  {editUserStatus, addUser, addMessage, getMessages, getUsers, getOtherUsers, getUserFromCookie, getUserFromUsername, removeUser}