import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";

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

type RegisterForm = {
  nombre: string;
  apellido: string;
  mail: string;
  dni: string;
  password: string;
  confirmPassword: string;
};

const initialForm: RegisterForm = {
  nombre: "",
  apellido: "",
  mail: "",
  dni: "",
  password: "",
  confirmPassword: "",
};

function Register() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof RegisterForm, value: string) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    const nombre = form.nombre.trim();
    const apellido = form.apellido.trim();
    const mail = form.mail.trim().toLowerCase();
    const dni = form.dni.trim();

    if (!/^\d+$/.test(dni)) {
      setError("El DNI debe contener solo numeros.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Las contrasenas no coinciden.");
      return;
    }

    setIsSubmitting(true);

    const { data, error: authError } = await supabase.auth.signUp({
      email: mail,
      password: form.password,
    });

    console.log("Supabase Auth signUp data:", data);
    console.error("Supabase Auth signUp error:", authError);

    if (authError) {
      setError(authError.message);
      setIsSubmitting(false);
      return;
    }

    if (!data.user) {
      setError("No se pudo crear el usuario.");
      setIsSubmitting(false);
      return;
    }

    const { data: profileData, error: profileError } = await supabase.from("usuarios").insert({
      id: data.user.id,
      nombre,
      apellido,
      mail,
      dni,
    });

    console.log("Supabase usuarios insert data:", profileData);
    console.error("Supabase usuarios insert error:", profileError);

    if (profileError) {
      setError(profileError.message);
      setIsSubmitting(false);
      return;
    }

    setForm(initialForm);
    setSuccessMessage("Usuario registrado correctamente.");
    setIsSubmitting(false);
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
            <CardTitle>Register</CardTitle>
            <CardDescription>Registrate para reservar turnos.</CardDescription>
          </CardHeader>
          <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                required
                value={form.nombre}
                onChange={(event) => updateField("nombre", event.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                id="apellido"
                required
                value={form.apellido}
                onChange={(event) => updateField("apellido", event.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="mail">Mail</Label>
              <Input
                id="mail"
                required
                type="email"
                value={form.mail}
                onChange={(event) => updateField("mail", event.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dni">DNI</Label>
              <Input
                id="dni"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                value={form.dni}
                onChange={(event) => updateField("dni", event.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Contrasena</Label>
              <Input
                id="password"
                minLength={6}
                required
                type="password"
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirmar contrasena</Label>
              <Input
                id="confirmPassword"
                minLength={6}
                required
                type="password"
                value={form.confirmPassword}
                onChange={(event) => updateField("confirmPassword", event.target.value)}
              />
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            {successMessage ? (
              <p className="text-sm text-emerald-600">{successMessage}</p>
            ) : null}

            <Button className="mt-2 w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Registrando..." : "Registrarme"}
            </Button>

            <Link
              className="text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
              to="/login"
            >
              ¿Ya tienes cuenta? Iniciar sesión
            </Link>
          </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default Register;
