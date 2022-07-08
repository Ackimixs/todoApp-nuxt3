import {defineEventHandler, setCookie, useBody} from "h3";
import { Users } from '~~/src/users';
import { UserModel } from "~/src/models";

const users = new Users(UserModel);

export default defineEventHandler(async (event) => {
    const { email, password } = await useBody(event)



    try {
        const credentials = await users.login({
            email,
            password
        })


        if (credentials === undefined) {
            return {
                result: null,
                error: "email or password incorrect"
            }
        }

        setCookie(event, 'nuxt3-todo-token-app', credentials.token, {
            expires: new Date(
                Date.now() + credentials.expiryInDays * 24 * 60 * 60 * 1000
            )
        })

        return {
            data: 'success',
            error: null
        }
    } catch (error) {
        return {
            result: null,
            error: error.message
        }
    }

})