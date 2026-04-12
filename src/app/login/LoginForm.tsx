"use client";

import { Button, Column, Heading, PasswordInput, Text } from "@once-ui-system/core";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LoginFormProps {
  redirectTo: string;
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(undefined);

    try {
      const response = await fetch("/api/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        router.push(redirectTo);
        router.refresh();
      } else if (response.status === 429) {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Incorrect password.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <Column paddingY="128" maxWidth={24} gap="24" center>
      <Heading align="center" wrap="balance">
        This page is password protected
      </Heading>
      <Text align="center" onBackground="neutral-weak" variant="body-default-s">
        Enter the password to view this content.
      </Text>
      <Column fillWidth gap="8" horizontal="center">
        <PasswordInput
          id="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          errorMessage={error}
        />
        <Button onClick={handleSubmit} loading={loading}>
          Unlock
        </Button>
      </Column>
    </Column>
  );
}
