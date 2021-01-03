import React from 'react'

const LoginForm = ({ handleLogin, username, setUsername, password, setPassword, id }) => {


  return (<div id={id}>
    <h2>Log in to application</h2>
    <form onSubmit={handleLogin}>
      <div>
      username
        <input
          className='username'
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
      password
        <input
          className='password'
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button  className='submit' type="submit">login</button>
    </form>
  </div>)
}

export default LoginForm