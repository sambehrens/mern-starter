import * as React from 'react';
import { Link } from 'react-router-dom';
import { AxiosError } from 'axios';
import { sendUserResetPasswordEmail } from '../../api/auth';
import { Header } from '../../modules/Header';

export function EnterEmail() {
  const [email, setEmail] = React.useState<string>('');
  const [emailSent, setEmailSent] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<{ error?: string }>({});

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function onSubmit(event: React.MouseEvent<HTMLFormElement>) {
    event.preventDefault();
    sendUserResetPasswordEmail({ email, url: window.location.origin })
      .then(() => {
        setEmailSent(true);
      })
      .catch((error: AxiosError) => setErrors(error.response?.data));
  }

  return (
    <div>
      <Link to={'/login'}>Back to log in</Link>
      <div>
        <Header variant={1}>Reset Password</Header>
        {emailSent ? (
          <div>
            <h2>Success</h2>
            <p>
              An email containing the reset password link was sent to <strong>{email}</strong>. It may take up to 5
              minutes to arrive.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <label>Email</label>
            <input
              id={'email'}
              onChange={onChange}
              value={email}
              autoFocus={true}
              name={'email'}
              type={'email'}
              autoComplete={'username'}
            />
            <div>{errors.error}</div>
            <input type={'submit'} value={'Send email'} />
          </form>
        )}
      </div>
    </div>
  );
}
