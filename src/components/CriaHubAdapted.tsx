import { useTheme } from '../contexts/ThemeContext';
import CriaHubImported from '../imports/CriaHub-16-2091';
import '../styles/criahub-dark.css';

export function CriaHubAdapted() {
  const { theme } = useTheme();

  return (
    <div className={`criahub-container w-full h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <CriaHubImported />
    </div>
  );
}
