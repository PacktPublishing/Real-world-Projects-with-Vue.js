const baseUri = 'https://api.tvmaze.com/'

export default {
  get (params) {
    let url = baseUri + params

    return fetch(url)
    .then(resp => resp.json())
  }
}
