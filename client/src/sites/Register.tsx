import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [label, setLebel] = useState('');
    var navigate = useNavigate();
    const server_path = localStorage.getItem('server_path');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const response = await fetch(server_path + '/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.status === 403) {
            setLebel("User are exist.");
        } else {
            const data = await response.json();
            Cookies.set('token', data.token, { expires: 1 / 24 });
            navigate("/");
        }
    }

    return (
        <div className="container d-flex align-items-center min-vh-100">
            <div className="row justify-content-center w-100">
                <div className="col-md-6 col-lg-4">
                    <h3 className="text-center mb-4">Register</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Email address</label>
                            <input type="text" className="form-control" id="username" placeholder="Enter email"
                            onChange={(e) => setUsername(e.target.value)}  />
                            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" id="password" placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        {label && (
                            <div className="mb-3">
                                <label style={{ color: 'red' }}>{label}</label>
                            </div>
                        )}
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary w-100">Submit</button>
                        </div>
                    </form>

                    <div className="mt-3 text-center">
                        <a href="/login">Login</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;