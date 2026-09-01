import { AppRoutes } from './routes/AppRoutes';
import { BusyOverlay, GlobalProgress } from './components/ui/Activity';
import { SuccessFx } from './components/ui/SuccessFx';
import { PortalSsoListener } from './components/portal/PortalSsoListener';

export default function App() {
  return (
    <>
      <GlobalProgress />
      <PortalSsoListener />
      <AppRoutes />
      <BusyOverlay />
      <SuccessFx />
    </>
  );
}
