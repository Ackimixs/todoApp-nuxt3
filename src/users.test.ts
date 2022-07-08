import {afterAll, beforeAll, describe, expect, test, vi} from "vitest";
import { Users, UsersToken } from './users'
import {PrismaClient, User} from '@prisma/client'
import JWT from 'jsonwebtoken'

const client = new  PrismaClient()

describe("users - constructor", () => {
    test('throws if options invalid', () => {
        // @ts-ignore
        expect(() => new Users()).throws();
    })

    test('throw if options invalid', () => {
        // @ts-ignore
        expect(() => new Users({})).throws();
    })

    test('return a Users object', () => {
        const users = new Users(client.user);
        expect(users.UserModel).toBeDefined()
    })
})



describe('users - hash password', () => {
    test('throw if options are invalid', async () => {
        // @ts-ignore
        await expect(Users.hashPassword()).rejects.toThrow('data and salt arguments required');
    });

    test('hashes a password', async () => {
        const hash = await Users.hashPassword('password');
        expect(hash).toMatch("$2b$10$");
    });
})

describe("users - isValidPassword", () => {
    test('return false is password is incorrect', async () => {
        const result = await Users.isValidPassword('password', 'hash');
        expect(result).toBe(false);
    })

    test('return true is password is correct', async () => {
        const hash = await Users.hashPassword('password');
        const isValidPassword = await Users.isValidPassword('password', hash);
        expect(isValidPassword).toBe(true);
    })
})

describe('users - tokens', () => {
    let user: User;
    let token: UsersToken;

    beforeAll(async () => {
        user = await client.user.create({
            data: {
                id: '123',
                email: 'test@test.com',
                password: 'password',
            }
        })
        token = Users.createToken(user)
    })

    afterAll(async () => {
        await client.user.delete({ where: {id: user.id}});
        token = undefined
        vi.resetAllMocks()
    })

    test('createToken - throws if no user is passed', () => {
        // @ts-ignore
        expect(() => Users.createToken()).throws();
    })

    test('createToken - return a token', () => {
        expect(token).toStrictEqual({
            token: expect.any(String),
            expiryInDays: 7,
        })
    })

    test('getUserInfoFromToken - throws if no token passed', () => {
        // @ts-ignore
        expect(() => Users.getUserInfoFromToken()).toThrow();
    })

    test('getUserInfoFromToken - return user info', () => {
        const userInfo = Users.getUserInfoFromToken(token.token);
        expect(userInfo).toStrictEqual({
            id: user.id,
            email: user.email
        })
    })

    test('getUserInfoFromToken - return undefined if an error occurs', () => {
        const mock = vi.spyOn(JWT, 'verify').mockImplementationOnce(() => { throw new Error('error') });

        const result = Users.getUserInfoFromToken(token.token);

        expect(mock).toHaveBeenCalled();
        expect(result).toBeUndefined();
    })
})

describe('users - add', () => {


    afterAll(async () => {
        await client.user.delete({where: {email: "test@test.com"}})
    })


    test('throws if options are invalid', async () => {
        // @ts-ignore
        await expect(new Users(client.user).add()).rejects.toThrow('"value" is required')
    })

    test('throws if options are invalid', async () => {
        // @ts-ignore
        await expect(new Users(client.user).add({})).rejects.toThrow('"email" is required')
    })

    test('throws if options are invalid', async () => {
        // @ts-ignore
        await expect(new Users(client.user).add(null)).rejects.toThrow('"value" must be of type object')
    })

    test('throws if options are invalid', async () => {
        // @ts-ignore
        await expect(new Users(client.user).add({email: null})).rejects.toThrow('"email" must be a string')
    })

    test('throws if options are invalid', async () => {
        // @ts-ignore
        await expect(new Users(client.user).add({email: null})).rejects.toThrow('"email" must be a string')
    })

    test('throws if options are invalid', async () => {
        // @ts-ignore
        await expect(new Users(client.user).add({email: ''})).rejects.toThrow('"email" is not allowed to be empty')
    })

    test('throws if options are invalid', async () => {
        // @ts-ignore
        await expect(new Users(client.user).add({email: 'notanemail'})).rejects.toThrow('"email" must be a valid email')
    })

    test('throws if options are invalid', async () => {
        // @ts-ignore
        await expect(new Users(client.user).add({email: 1})).rejects.toThrow('"email" must be a string')
    })

    test('throws if options are invalid', async () => {
        // @ts-ignore
        await expect(new Users(client.user).add({email: 'test@test.com', password: ''})).rejects.toThrow('"password" is not allowed to be empty')
    })

    test('throws if options are invalid', async () => {
        // @ts-ignore
        await expect(new Users(client.user).add({email: 'test@test.com', password: null})).rejects.toThrow('"password" must be a string')
    })

    test('throws if options are invalid', async () => {
        // @ts-ignore
        await expect(new Users(client.user).add({email: 'test@test.com', password: 1})).rejects.toThrow('"password" must be a string')
    })

    test('throws if options are invalid', async () => {
        // @ts-ignore
        await expect(new Users(client.user).add({email: 'test@test.com', password: '1'})).rejects.toThrow('"password" length must be at least 8 characters long')
    })

    test('throws if options are invalid', async () => {
        // @ts-ignore
        await expect(new Users(client.user).add({email: 'test@test.com', password: '1234567891011121314151617181920212221'})).rejects.toThrow('"password" length must be less than or equal to 36 characters long')
    })

    test('throws if options are invalid', async () => {
        // @ts-ignore
        await expect(new Users(client.user).add({email: 'test@test.com', password: 'password'})).rejects.toThrow('"passwordConfirm" is required')
    })

    test('throws if options are invalid', async () => {
        // @ts-ignore
        await expect(new Users(client.user).add({email: 'test@test.com', password: 'password', passwordConfirm: 'notPassword'})).rejects.toThrow('"passwordConfirm" must be [ref:password]')
    })

    test('successfully create user', async () => {
        // @ts-ignore
        const users = await new Users(client.user).add({
            email: 'test@test.com',
            password: 'password',
            passwordConfirm: "password"
        });
        expect(users).toStrictEqual({
          id: expect.any(String),
          email: "test@test.com",
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        })
    })

    test('throws if duplicate email', async () => {
        await expect(new Users(client.user).add({email: "test@test.com", password: "password", passwordConfirm: "password"})).rejects.toThrow()
    })
})

describe('users - login', () => {
    let user: User;

    beforeAll(async () => {
        const hash = await Users.hashPassword('password')
        user = await client.user.create({
            data: {
                id: '123',
                email: 'test@test.com',
                password: hash
            }
        })
    })

    afterAll(async () => {
        await client.user.delete({where: {id: user.id}})
    })

    test('throws if options invalid', async () => {
        // @ts-ignore
        await expect(new Users(client.user).login({})).rejects.toThrow()
    })

    test('return undefined if user does not exist', async () => {
        const result = await new Users(client.user).login({email: 'noexist@test.com', password: 'password'})

        expect(result).toBeUndefined()
    })

    test('return undefined if password is incorrect', async () => {
        const result = await new Users(client.user).login({email: 'test@test.com', password: 'passwordIncorrect'})

        expect(result).toBeUndefined()
    })

    test('return a token if credentials are valid', async () => {
        const result = await new Users(client.user).login({email: user.email, password: 'password'})

        expect(result).toStrictEqual({
            token: expect.any(String),
            expiryInDays: 7
        })
    })
})