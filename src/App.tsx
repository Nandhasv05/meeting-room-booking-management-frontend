import { AppRoutes } from './routes/AppRoutes';
import { BusyOverlay, GlobalProgress } from './components/ui/Activity';
import { SuccessFx } from './components/ui/SuccessFx';

export default function App() {
  return (
    <>
      <GlobalProgress />
      <AppRoutes />
      <BusyOverlay />
      <SuccessFx />
    </>
  );
}
