function Login() {
return (
    <div className='wrapper'>
      <form>
        <h1> Login</h1>

        <div className='input-box'>
          <input type="text" placeholder='UserName' required />
          <FaUser className='Icon' />
        </div>

        <div className='input-box'>
          <input type="password" placeholder='Password' required />
          <FaLock className='Icon' />
        </div>

        <div className="remember-forgot">
          <label>
            <input type="checkbox" /> Remember Me
          </label>
          <a href='#'> Forgot Password? </a>
        </div>

        <button type='submit'>Login</button>

        <div className="register-link">
          <p>
            Don't have an Account?
            <Link to="/register"> Register Now </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
export default Login;
