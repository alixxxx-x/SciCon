import Form from "../components/form";

function Login() {
    return <Form route="/api/token/get/" method="login" />;
}
export default Login;
