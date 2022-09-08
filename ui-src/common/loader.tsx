import PropagateLoader from 'react-spinners/PropagateLoader';
import twColors from 'tailwindcss/colors';

interface Props {
  size?: number;
  height?: number;
}

const Loader = ({ size = 20, height = 40 }: Props) => {
  return (
    <PropagateLoader
      size={size}
      color={twColors.blue[300]}
      cssOverride={{
        height: height,
        display: 'grid',
        placeItems: 'center',
      }}
    />
  );
};

export { Loader };
