import { ME, FIND_GENRE } from '../queries'
import { useQuery, useLazyQuery } from '@apollo/client'
import { useEffect } from 'react'

const RecommendedBooks = () => {
  const userResult = useQuery(ME)
  const [getBooks, booksResult] = useLazyQuery(FIND_GENRE, { fetchPolicy: 'no-cache' })

  useEffect(() => {
    if (userResult.data?.me?.favoriteGenre) {
      getBooks({ variables: { genre: userResult.data.me.favoriteGenre } })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userResult.data])

  if (userResult.loading || !booksResult.called || booksResult.loading) {
    return <div>loading...</div>
  }

  const favoriteGenre = userResult.data.me.favoriteGenre
  const books = booksResult.data.allBooks

  return (
    <>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <strong>{favoriteGenre}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default RecommendedBooks
