self.addEventListener('message', (e) => {
  let songs = e.data.songs
  let search = e.data.search

  let filteredSongs = songs.filter(song => {
    return (song.title.includes(search) || song.album.includes(search) || song.artist.includes(search))
  })

  self.postMessage({ filteredSongs })
})
