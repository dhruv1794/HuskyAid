function isValidUsername(username) {
    let isValid = true;
    isValid = isValid && username.trim();
    isValid = isValid && username.match(/^[A-Za-z0-9_]+$/);
    return isValid;
  }

  const isAuth = (req) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';
    if(!sid || !username) {
      return {error: 'auth-missing', isAuthenticated:false }
    }
    return {error:null, isAuthenticated:true};
}



  module.exports = {
    isValidUsername,
    isAuth
  };