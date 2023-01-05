import { useEffect, useRef, useState } from 'react';
import hitToast from '../helpers/hitToast';

export default function SubscriptionForm() {
  let [email, setEmail] = useState('');
  let [alertClass, setAlertClass] = useState('');
  const [submittingEmail, setSubmittingEmail] = useState(false);
  var inputElement = useRef(null);

  useEffect(() => {
    inputElement.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate(email)) {
      setAlertClass('alert-validate');
      return;
    }
    try {
      setSubmittingEmail(true);
      const res = await fetch('http://103.108.146.90:5000/sendemail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      hitToast(data.success ? 'success' : 'error', data.message);
      setSubmittingEmail(false);
    } catch {
      hitToast('error', 'Something went wrong. Please try again.');
      setSubmittingEmail(false);
    }

    setAlertClass('');
  };

  const validate = (email) => {
    const emailRegex =
      /^([a-zA-Z0-9_\-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/;
    if (email.trim().match(emailRegex) == null) {
      return false;
    } else if (email.trim() === '') {
      return false;
    }

    return true;
  };

  return (
    <form className='w-full flex-w flex-c-m validate-form' onSubmit={handleSubmit}>
      <div
        className={'wrap-input100 validate-input where1 ' + alertClass}
        data-validate='Valid email is required: user@email.domain'
      >
        <input
          ref={inputElement}
          className='input100 placeholder0 s2-txt2'
          type='text'
          name='email'
          placeholder='Enter Email Address'
          onChange={(e) => {
            setAlertClass('');
            setEmail(e.target.value);
          }}
        />
        <span className='focus-input100'></span>
      </div>

      <button
        disabled={submittingEmail}
        className={`flex-c-m size3 s2-txt3 how-btn1 trans-04 where1 ${submittingEmail && 'cursor-not-allowed'}`}
      >
        {submittingEmail ? 'Subscribing' : 'Subscribe'}
      </button>
    </form>
  );
}
