import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { SET_BIRTHYEAR } from '../queries'
import Select from 'react-select'

const BirthYearForm = ({ authors }) => {
  const [name, setName] = useState(null)
  const [born, setBorn] = useState('')

  const [setBirthyear] = useMutation(SET_BIRTHYEAR)

  const options = authors.map((author) => ({
    value: author.name,
    label: author.name
  }))

  const submit = (event) => {
    event.preventDefault()
    setBirthyear({ variables: { name: name.value, born: parseInt(born) } })

    setName(null)
    setBorn('')
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <Select value={name} onChange={setName} options={options} />
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
