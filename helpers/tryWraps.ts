export const tryWraps = async (promiseCb) => {
    try {
        const result = await promiseCb()
        return {result, error: null}
    }
    catch (error) {
        return {result: null, error: error}
    }
}