import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

function Login() {
  const navigate = useNavigate();
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: mail.trim().toLowerCase(),
      password,
    });

    if (loginError) {
      setError(loginError.message);
      setIsSubmitting(false);
      return;
    }

    setSuccessMessage("Sesion iniciada correctamente.");
    setTimeout(() => navigate("/my-appointments"), 800);
  };

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-8 text-left">
      <div className="grid w-full max-w-md gap-6">
        <header className="text-center">
          <h1 className="brand-title text-4xl">ARANGURI BARBERSHOP</h1>
          <p className="mt-2 text-muted-foreground">
            Reserva tu turno online
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Iniciar sesion</CardTitle>
            <CardDescription>Ingresa para ver tus turnos.</CardDescription>
          </CardHeader>
          <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="mail">Mail</Label>
              <Input
                autoComplete="email"
                id="mail"
                required
                type="email"
                value={mail}
                onChange={(event) => setMail(event.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Contrasena</Label>
              <Input
                autoComplete="current-password"
                id="password"
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            {successMessage ? (
              <p className="text-sm text-emerald-600">{successMessage}</p>
            ) : null}

            <Button className="mt-2 w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </Button>

            <Link
              className="text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
              to="/register"
            >
              ¿No tienes cuenta? Registrarse
            </Link>
          </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default Login;
