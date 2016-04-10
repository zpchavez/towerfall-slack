// Check if a fetch response is a JSON response
module.exports = (response) => {
    return (
        response.headers.has('content-type') &&
        response.headers.getAll('content-type').indexOf(
            'application/json; charset=utf-8'
        ) !== -1
    );
}
