import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { SET_BIRTHYEAR } from '../queries'

const BirthYearForm = () => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [setBirthyear] = useMutation(SET_BIRTHYEAR)

  const submit = (event) => {
    event.preventDefault()
    setBirthyear({ variables: { name, born: parseInt(born) } })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name
          <input value={name} onChange={({ target }) => setName(target.value)} />
        </div>
        <div>
          born
          <input value={born} onChange={({ target }) => setBorn(target.value)} />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default BirthYearForm
