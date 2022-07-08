import { Users } from '~/src/users'
import { UserModel } from "~/src/models";
import { tryWraps } from "~/helpers/tryWraps";
import {defineEventHandler, useBody} from "h3";

const users = new Users(UserModel)


export default defineEventHandler(async (event) => {

    const body = await useBody(event);

    const {result, error} = await tryWraps(async () => {
        const { email, password, passwordConfirm } = body;
        return await users.add({
            email,
            password,
            passwordConfirm
        })
    })

    if (error) {
        return {
            result: null,
            error: error.message
        }
    }
    else {
        return { result, error: null };
    }
})