const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
    let users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Jack',
            room: 'Developers'
        }, {
            id: '2',
            name: 'James',
            room: 'Managers'
        }, {
            id: '3',
            name: 'Joe',
            room: 'Developers'
        }];
    });

    it('Should add new user', () => {
        let users = new Users();
        let user = {
            id: '123',
            name: 'Shuanghao',
            room: 'Juventus Fans'
        };
        let resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it('Should remove a user', () => {
        let userId = '1';
        let user = users.removeUser(userId);

        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });

    it('Should not remove a user', () => {
        let userId = '99';
        let user = users.removeUser(userId);

        expect(user).toBeFalsy();
        expect(users.users.length).toBe(3);
    });

    it('Should find user', () => {
        let userId = '1';
        let user = users.getUser(userId);

        expect(user.id).toBe(userId);
    });

    it('Should not find user', () => {
        let userId = '100';
        let user = users.getUser(userId);

        expect(user).toBeFalsy();
    });

    it('Should return user names for Developers', () => {
        let userList = users.getUserList('Developers');

        expect(userList).toEqual(['Jack', 'Joe']);
    });

    it('Should return user names for Managers', () => {
        let userList = users.getUserList('Managers');
        
        expect(userList).toEqual(['James']);
    });
});