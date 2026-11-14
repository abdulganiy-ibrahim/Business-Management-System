'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { Check, Loader2, LockKeyhole } from 'lucide-react';
import SlowRequestNotice from '@/components/network/SlowRequestNotice';
import { SIGN_UP_PATH } from '@/lib/auth/authRoutes';
import { updatePassword } from './updatePassword';
import { getNetworkErrorMessage } from '@/lib/network/networkMessages';
import {
  MIN_PASSWORD_LENGTH,
  validateNewPassword,
  validatePasswordConfirmation,
} from '@/utils/authValidation';
import { iconBadgeClass, primaryButtonClass } from './authStyles';
import PasswordField from './PasswordField';
import PasswordStrengthMeter from './PasswordStrengthMeter';

// Where "Continue" goes once the password is saved.
// TODO: change it if you'd rather send people straight to their dashboard.
const CONTINUE_PATH = SIGN_UP_PATH;

type FieldErrors = { password?: string; confirmPassword?: string };

/** Two screens in one: the new password form, and the "password updated" confirmation. */
export default function UpdatePasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const changePassword = (value: string) => {
    setPassword(value);
    setErrors((previous) => ({ ...previous, password: undefined }));
    setFormError('');
  };

  const changeConfirmPassword = (value: string) => {
    setConfirmPassword(value);
    setErrors((previous) => ({ ...previous, confirmPassword: undefined }));
    setFormError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors: FieldErrors = {
      password: validateNewPassword(password),
      confirmPassword: validatePasswordConfirmation(password, confirmPassword),
    };
    setErrors(newErrors);
    if (newErrors.password || newErrors.confirmPassword) return;

    setIsSubmitting(true);
    setFormError('');

    try {
      await updatePassword(password);
      setIsDone(true);
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

  // ---------- Screen 2: the password was saved ----------
  if (isDone) {
    return (
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <span className={iconBadgeClass}>
          <Check className="size-7" />
        </span>

        <h1 className="text-2xl font-semibold text-foreground">Password updated</h1>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          Your password has been changed. You can now log in with your new
          password.
        </p>

        <Link href={CONTINUE_PATH} className={`${primaryButtonClass} mt-8`}>
          Continue to log in
        </Link>
      </div>
    );
  }

  // ---------- Screen 1: type the new password ----------
  const passwordsMatch =
    confirmPassword !== '' && confirmPassword === password && !errors.confirmPassword;

  return (
    <div className="w-full max-w-sm">
      <span className={iconBadgeClass}>
        <LockKeyhole className="size-7" />
      </span>

      <h1 className="text-2xl font-semibold text-foreground">Set a new password</h1>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
        Choose a strong password you haven&apos;t used before. You&apos;ll use it to
        log in.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-5">
        <div className="flex flex-col gap-2.5">
          <PasswordField
            id="new-password"
            label="New password"
            value={password}
            onChange={changePassword}
            error={errors.password}
            disabled={isSubmitting}
          />
          {/* The requirement first, then a live strength bar once they start typing */}
          {password ? (
            <PasswordStrengthMeter password={password} />
          ) : (
            <p className="text-xs text-text-secondary">
              Use at least {MIN_PASSWORD_LENGTH} characters.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <PasswordField
            id="confirm-new-password"
            label="Confirm new password"
            value={confirmPassword}
            onChange={changeConfirmPassword}
            error={errors.confirmPassword}
            disabled={isSubmitting}
          />
          {passwordsMatch && (
            <p className="flex items-center gap-1.5 text-xs text-primary">
              <Check className="size-3.5" />
              Passwords match
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
              Saving...
            </>
          ) : (
            'Save password'
          )}
        </button>
      </form>
    </div>
  );
}