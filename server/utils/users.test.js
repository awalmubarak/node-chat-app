const expect = require('expect');
const {Users} = require('./users');

describe('Utils/Users', ()=>{
    var users;
    beforeEach(()=>{
        users = new Users();
        users.users = [
            { id: 1, name: 'awal', room: 'gh' },
            { id: 2, name: 'max', room: 'ng' },
            { id: 3, name: 'muba', room: 'gh' },
            { id: 4, name: 'love', room: 'ng' },
        ];

    });

    it('should add new user', ()=>{
        var users = new Users();
        var returnedUser = users.addUser(323, 'Max', 'Code');
        expect(users.users).toEqual([returnedUser]);
    });

    it('should remove a user by id', ()=>{
        var user = users.removeUser(2);
        expect(users.users.length).toBe(3);
        expect(user.id).toBe(2);
    });

    it('should not remove a user by id', () => {
        var user = users.removeUser(5);
        expect(users.users.length).toBe(4);
        expect(user).toBeFalsy();
    });

    it('should get User by Id', ()=>{
        var user = users.getUser(3);
        expect(user).toEqual(users.users[2]);
        expect(users.users.length).toBe(4);
    });

    it('should not get User by Id', () => {
        var user = users.getUser(6);
        expect(user).toBeFalsy();
        expect(users.users.length).toBe(4);
    });

    it('should get User by Name', () => {
        var user = users.getUserByName('max');
        expect(user).toBeTruthy();
        expect(user.name).toBe('max');
        expect(user.id).toBe(2);
        expect(users.users.length).toBe(4);
    });

    it('should not get User by Name', () => {
        var user = users.getUserByName('jill');
        expect(user).toBeFalsy();
        expect(users.users.length).toBe(4);
    });


    it('should get users name list for gh room', () => {
        var userList = users.getUserList('gh');
        expect(userList).toEqual(['awal','muba']);
        expect(userList.length).toBe(2);
    });

    it('should get users name list for ng room', () => {
        var userList = users.getUserList('ng');
        expect(userList).toEqual([ 'max', 'love']);
        expect(userList.length).toBe(2);
    });

    it('should get all active rooms', () => {
        var rooms = users.getActiveRooms();
        expect(rooms).toEqual(['gh', 'ng']);
        expect(rooms.length).toBe(2);
    });
});
