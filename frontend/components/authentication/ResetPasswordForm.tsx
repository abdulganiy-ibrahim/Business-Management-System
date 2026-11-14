'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { ArrowLeft, KeyRound, Loader2, MailCheck } from 'lucide-react';
import SlowRequestNotice from '@/components/network/SlowRequestNotice';
import { SIGN_UP_PATH } from '@/lib/auth/authRoutes';
import { requestPasswordReset } from './requestPasswordReset';
import { getNetworkErrorMessage } from '@/lib/network/networkMessages';
import { validateEmail } from '@/utils/authValidation';

// Class strings in one place. Swap them for the ones your sign-in form uses if you prefer.
const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';
const inputClass = `h-11 w-full rounded-xl border bg-background-card px-3.5 text-sm text-foreground transition-colors placeholder:text-text-secondary/70 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary`;
const primaryButtonClass = `flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`;
const iconBadgeClass =
  'mb-6 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary';

/** Two screens in one: the email form, and the "check your email" confirmation. */
export default function ResetPasswordForm() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null); // set once the email was sent

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateEmail(email);
    setEmailError(validationError ?? '');
    if (validationError) return;

    setIsSubmitting(true);
    setFormError('');

    try {
      await requestPasswordReset(email.trim());
      setSentTo(email.trim());
    } catch (error) {
      setFormError(
        getNetworkErrorMessage(error) ??
          (error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const backToLogin = (
    <Link
      href={SIGN_UP_PATH}
      className={`inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-text-secondary hover:text-foreground ${focusRing}`}
    >
      <ArrowLeft className="size-4" />
      Back to log in
    </Link>
  );

  // ---------- Screen 2: the email was sent ----------
  if (sentTo) {
    return (
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <span className={iconBadgeClass}>
          <MailCheck className="size-7" />
        </span>

        <h1 className="text-2xl font-semibold text-foreground">Check your email</h1>
        {/* Doesn't say whether the account exists, so nobody can use this form to find out who has one */}
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          If an account exists for{' '}
          <span className="font-medium break-all text-foreground">{sentTo}</span>,
          we&apos;ve sent a link to reset your password. It can take a minute to
          arrive, so check your spam folder too.
        </p>

        <button
          type="button"
          onClick={() => setSentTo(null)}
          className={`mt-6 cursor-pointer rounded-md text-sm font-medium text-primary hover:underline ${focusRing}`}
        >
          Use a different email
        </button>

        <div className="mt-6">{backToLogin}</div>
      </div>
    );
  }

  // ---------- Screen 1: ask for the email ----------
  return (
    <div className="w-full max-w-sm">
      <span className={iconBadgeClass}>
        <KeyRound className="size-7" />
      </span>

      <h1 className="text-2xl font-semibold text-foreground">Reset your password</h1>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
        Enter the email you signed up with and we&apos;ll send you a link to
        reset your password.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reset-email" className="text-sm font-medium text-foreground">
            Email address
          </label>
          <input
            id="reset-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setEmailError('');
              setFormError('');
            }}
            disabled={isSubmitting}
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? 'reset-email-error' : undefined}
            className={`${inputClass} ${emailError ? 'border-danger' : 'border-border'}`}
          />
          {emailError && (
            <p id="reset-email-error" className="text-xs text-danger">
              {emailError}
            </p>
          )}
        </div>

        {formError && (
          <p
            role="alert"
            className="rounded-xl bg-danger/10 px-3.5 py-3 text-sm text-danger"
          >
            {formError}
          </p>
        )}

        <SlowRequestNotice isPending={isSubmitting} />

        <button type="submit" disabled={isSubmitting} className={primaryButtonClass}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending link...
            </>
          ) : (
            'Reset password'
          )}
        </button>
      </form>

      <div className="mt-6 flex justify-center">{backToLogin}</div>
    </div>
  );
}