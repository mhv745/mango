
const baseUrl = "http://demo9008528.mockable.io/"

export const get = (url) => {
    return window.fetch(`${baseUrl}${url}`)
        .then(res => res.json())
}