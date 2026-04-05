import ForgotPasswordVerifyClient from "./verify-client";

type VerifyPageProps = {
  searchParams?: Promise<{
    email?: string;
    otpPreview?: string;
  }>;
};

export default async function ForgotPasswordVerifyPage({ searchParams }: VerifyPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};

  return (
    <ForgotPasswordVerifyClient
      email={resolvedSearchParams.email ?? ""}
      otpPreview={resolvedSearchParams.otpPreview ?? ""}
    />
  );
}
