import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';

import {
    loginStart,
    loginSuccess,
    loginFailure
} from '../auth/authSlice';

import api from '../../api/axios';

export default function LoginBS() {

    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state: RootState) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as any)?.from || "/dashboard";

    // ✅ REDIRECT
    useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
    }, [user]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        dispatch(loginStart());

        try {
            const { data: users } = await api.get(`/users?email=${email}`);

            if (!users.length || users[0].password !== password) {
                dispatch(loginFailure("Email ou mot de passe incorrect"));
                return;
            }

            const user = {
                id: users[0].id,
                email: users[0].email,
                name: users[0].name
            };

            const token = btoa(JSON.stringify({
                userId: user.id,
                email: user.email,
                role: 'admin',
                exp: Date.now() + 3600000
            }));

            dispatch(loginSuccess({
                user,
                token
            }));

        } catch {
            dispatch(loginFailure("Erreur serveur"));
        }
    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Card style={{ width: 400 }}>
                <Card.Body>

                    <h3 className="text-center text-success mb-3">
                        TaskFlow
                    </h3>

                    <p className="text-center text-muted">
                        Connectez-vous pour continuer
                    </p>

                    {error && (
                        <Alert variant="danger">{error}</Alert>
                    )}

                    <Form onSubmit={handleSubmit}>

                        <Form.Control
                            className="mb-3"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Form.Control
                            className="mb-3"
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Button
                            type="submit"
                            className="w-100"
                            variant="success"
                            disabled={loading}
                        >
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </Button>

                    </Form>

                </Card.Body>
            </Card>
        </Container>
    );
}