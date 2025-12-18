import { useState } from "react"

function LogIn({ login }) {
  const init = { username: "", password: "" };
  const [loginCredentials, setLoginCredentials] = useState(init);

  const performLogin = (evt) => {
    evt.preventDefault();
    login(loginCredentials.username, loginCredentials.password);
  }
  const onChange = (evt) => {
    setLoginCredentials({ ...loginCredentials,[evt.target.id]: evt.target.value })
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={performLogin}>
        <input placeholder="User Name" id="username" onChange={onChange} value={loginCredentials.username} />
        <input placeholder="Password" id="password" onChange={onChange} value={loginCredentials.password} />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
export default LogIn