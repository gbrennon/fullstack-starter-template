import { trpc } from '@utils/trpc';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SignUpCardUI, { SignUpFormData } from './SignUpCardUI';

const SignUpCard = () => {
  const navigate = useNavigate();

  const signUpMutation = trpc.auth.signUp.useMutation({
    onSuccess() {
      toast.info('Account created successfully!');
      navigate('/login');
    },
    onError(error) {
      toast.error(error.message);
    },
  });
  const onSubmit = (values: SignUpFormData) => {
    signUpMutation.mutate(values);
  };
  return <SignUpCardUI onSubmit={onSubmit} />;
};

export default SignUpCard;
