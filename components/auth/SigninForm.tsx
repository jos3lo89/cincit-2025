"use client";

import { signinAction } from "@/actions/auth.action";
import { signInSchema, SignInType } from "@/schemas/auth.schema";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const SigninForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const signupForm = useForm<SignInType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInType) => {
    startTransition(async () => {
      const res = await signinAction(values);
      if (res.error) {
        setError(res.error);
      } else {
        toast.success("Vienvenido");
        signupForm.reset();
        router.push("/");
      }
    });
  };
  return (
    <>
      <Form {...signupForm}>
        <form
          onSubmit={signupForm.handleSubmit(onSubmit)}
          className="space-y-6 rounded-lg border border-white/10 p-6"
        >
          <FormField
            control={signupForm.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="email" className="text-sm font-medium ">
                  Correo
                </FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="on"
                    required
                    {...field}
                    className="w-full px-3 py-2"
                    placeholder="tu@email.com"
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={signupForm.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="password" className="text-sm font-medium ">
                  Contraseña
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    id="password"
                    autoComplete="off"
                    required
                    {...field}
                    className="w-full px-3 py-2  "
                    placeholder="••••••••"
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-400" />
              </FormItem>
            )}
          />

          <Button
            disabled={isPending}
            className="w-full font-medium py-2 px-4 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-default"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </Button>
        </form>
      </Form>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <Terminal />
          <AlertTitle>¡Atención!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </>
  );
};
export default SigninForm;
