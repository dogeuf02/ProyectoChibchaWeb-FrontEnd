import { Backdrop } from '@mui/material';
import { useGlobalLoading } from '../../context/LoadingContext';
import SpinningLogo from './SpinningLogo';

export default function GlobalLoader() {
  const { loading } = useGlobalLoading();

  return (
    <Backdrop
      open={loading}
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.modal + 1,
        flexDirection: 'column',
      }}
    >
      <SpinningLogo size={80} />
    </Backdrop>
  );
}
