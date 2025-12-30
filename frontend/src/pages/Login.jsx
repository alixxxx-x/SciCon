import Form from "../components/Form";

function Login() {
    return <Form route="/api/token/get/" method="login" />;
}
export default Login;
