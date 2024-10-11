import { ALL_BOOKS, FIND_GENRE } from '../queries'
import { useQuery, useLazyQuery } from '@apollo/client'
import Select from 'react-select'
import { useState } from 'react'

const Books = () => {
  const [genre, setGenre] = useState(null)
  const result = useQuery(ALL_BOOKS)
  const [getGenre, filterResult] = useLazyQuery(FIND_GENRE, { fetchPolicy: 'no-cache' })

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks

  let genres = books.reduce((allGenres, curBook) => allGenres.concat(curBook.genres), [])
  genres = [...new Set(genres)] // Get unique genres
  const options = genres.map((genre) => ({
    value: genre,
    label: genre
  }))
  options.unshift({ value: 'all genres', label: 'all genres' })

  const submit = (event) => {
    event.preventDefault()

    if (!genre || genre.value === 'all genres') {
      getGenre()
    } else {
      getGenre({ variables: { genre: genre.value } })
    }

    setGenre(null)
  }

  const filteredBooks =
    filterResult.data && filterResult.data.allBooks.length !== 0 ? filterResult.data.allBooks : books

  return (
    <div>
      <h2>books</h2>

      <div>
        <form onSubmit={submit}>
          <Select value={genre} onChange={setGenre} options={options} />
          <button type="submit">filter by genre</button>
        </form>
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
