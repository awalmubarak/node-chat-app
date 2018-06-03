class Users{
    constructor(){
        this.users = [];
    }

    addUser(id, name, room) {
        var user = {id, name, room};
        this.users.push(user);
        return user;
    }

    getUser(id) {
       return this.users.filter((user)=>user.id===id)[0];
    }

    removeUser(id) {
        var delUser;
        this.users = this.users.filter((user)=>{
            if(user.id===id) delUser= user;
            return user.id !== id;
        });
        return delUser;
    }

    getUserList(room) {
        var users = this.users.filter((user)=>user.room===room);
        return users.map((user)=>user.name);
    }
}

module.exports = {Users};