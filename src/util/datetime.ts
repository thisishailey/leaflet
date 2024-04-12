export const getElapsedTime = (prev: Date) => {
    const now = new Date();

    if (
        now.toDateString() === prev.toDateString() &&
        now.getUTCDate() === prev.getUTCDate()
    ) {
        if (now.getUTCHours() === prev.getUTCHours()) {
            if (now.getUTCMinutes() === prev.getUTCMinutes()) {
                return `${now.getUTCSeconds() - prev.getUTCSeconds()}초 전`;
            }

            return `${now.getUTCMinutes() - prev.getUTCMinutes()}분 전`;
        }

        return `${now.getUTCHours() - prev.getUTCHours()}시간 전`;
    }

    if (now.getUTCFullYear() === prev.getUTCFullYear()) {
        return `${prev.getMonth()}/${prev.getDate()}`;
    }

    return `${prev.getMonth()}/${prev.getDate()}/${prev.getFullYear()}`;
};
