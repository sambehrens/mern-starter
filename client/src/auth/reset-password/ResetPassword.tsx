import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { setNewUserPassword, verifyResetPasswordToken } from '../../api/auth';
import { Header } from '../../modules/Header';

export function ResetPassword() {
  const [password, setPassword] = React.useState<string>('');
  const [password2, setPassword2] = React.useState<string>('');
  const [errors, setErrors] = React.useState<{ error?: string }>({});
  const [verified, setVerified] = React.useState<boolean>(false);
  const [verifyFailed, setVerifyFailed] = React.useState<boolean>(false);
  const [passwordReset, setPasswordReset] = React.useState<boolean>(false);

  const { jwt } = useParams<{ jwt: string }>();

  React.useEffect(() => {
    verifyResetPasswordToken({ token: jwt })
      .then(() => setVerified(true))
      .catch(() => setVerifyFailed(true));
  }, [jwt]);

  function onSubmit(event: React.MouseEvent<HTMLFormElement>) {
    event.preventDefault();
    setNewUserPassword({ token: jwt, password, password2 })
      .then(() => setPasswordReset(true))
      .catch((error: AxiosError) => setErrors(error.response?.data));
  }

  function getFormMarkup() {
    if (!verified && !verifyFailed) {
      return 'Verifying...';
    }
    if (passwordReset) {
      return (
        <div>
          Password reset successfully.{' '}
          <Link to={'/login'} className={'link secondary'}>
            Return to log in page.
          </Link>
        </div>
      );
    }
    if (verifyFailed) {
      return 'Verification failed. Please restart the Reset Password process.';
    }
    return (
      <form onSubmit={onSubmit}>
        <label>Password</label>
        <input
          id={'password'}
          onChange={e => setPassword(e.target.value)}
          value={password}
          autoFocus={true}
          name={'password'}
          type={'password'}
          autoComplete={'new-password'}
        />
        <label>Confirm Password</label>
        <input
          id={'password2'}
          onChange={e => setPassword2(e.target.value)}
          value={password2}
          name={'password'}
          type={'password'}
          autoComplete={'new-password'}
        />
        <div>{errors.error}</div>
        <input type={'submit'} value={'Save'} />
      </form>
    );
  }

  return (
    <div>
      <Header variant={1}>Set New Password</Header>
      {getFormMarkup()}
    </div>
  );
}
