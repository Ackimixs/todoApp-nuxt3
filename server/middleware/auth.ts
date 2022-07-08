import {useCookie} from "h3";
import { Users} from "~/src/users"

export default defineEventHandler(async (event) => {
    const cookie = useCookie(event, "nuxt3-todo-token-app")

    if (!cookie) {
        return;
    }

    const verifiedUser = Users.getUserInfoFromToken(cookie);

    if (verifiedUser === undefined) {
        return;
    }

    event.context.user = verifiedUser;
})