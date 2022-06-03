async function slashRolePermission(allowedRole, userRole) {
  var allowed = false
  if (allowedRole == 'everyone'){
    allowed = true
  }
  else{
    for(var i = 0; i < allowedRole.length ;i++ ){
      const found = userRole.member._roles.includes(allowedRole[i])
      if (found == true){
        allowed = true
      }
    }
  }
  
  return allowed



}

module.exports = { slashRolePermission };
