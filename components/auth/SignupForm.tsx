"use client";
import { Loader2, Terminal } from "lucide-react";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Role } from "@/app/generated/prisma";
import { useState, useTransition } from "react";
import { signUpSchema, SignUpType } from "@/schemas/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupAction } from "@/actions/auth.action";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const SignupForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const signupForm = useForm<SignUpType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      dni: "",
      institution: "",
      telephone: "",
      password: "",
      role: "ADMINISTRATOR",
    },
  });

  const onSubmit = async (values: SignUpType) => {
    startTransition(async () => {
      const res = await signupAction(values);
      if (res.error) {
        setError(res.error);
      } else {
        toast.success("Usuario creado");
        signupForm.reset();
      }
    });
  };

  return (
    <>
      <Form {...signupForm}>
        <form
          onSubmit={signupForm.handleSubmit(onSubmit)}
          className="space-y-4 rounded-lg border-white/10 p-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormField
              control={signupForm.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="name" className="text-sm font-medium">
                    Nombre *
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      type="text"
                      autoComplete="on"
                      required
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signupForm.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="lastName" className="text-sm font-medium">
                    Apellidos *
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="lastName"
                      type="text"
                      autoComplete="on"
                      required
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={signupForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email" className="text-sm font-medium">
                    Email *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      required
                      id="email"
                      autoComplete="on"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signupForm.control}
              name="dni"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="dni" className="text-sm font-medium">
                    DNI *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      required
                      id="dni"
                      autoComplete="on"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={signupForm.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="institution"
                    className="text-sm font-medium"
                  >
                    Institucion *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      required
                      id="institution"
                      autoComplete="on"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signupForm.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="telephone"
                    className="text-sm font-medium"
                  >
                    Telefono *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      required
                      id="telephone"
                      autoComplete="on"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={signupForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password" className="text-sm font-medium">
                    Contraseña *
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="off"
                      required
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={signupForm.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Rol de Usuario *
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={Role.ADMINISTRATOR}>
                        ADMINISTRATOR
                      </SelectItem>
                      <SelectItem value={Role.INSCRIBER}>INSCRIBER</SelectItem>
                      <SelectItem value={Role.PARTICIPANT}>
                        PARTICIPANT
                      </SelectItem>
                      <SelectItem value={Role.STAFF}>STAFF</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            disabled={isPending}
            className="w-full font-medium py-2 px-4 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-default"
            type="submit"
          >
            {isPending ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creando cuenta...</span>
              </div>
            ) : (
              "Crear Cuenta"
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
export default SignupForm;
