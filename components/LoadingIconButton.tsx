import { ClipLoader } from "react-spinners";

type LoadingIconButtonProps = {
  mr?: boolean;
};
const LoadingIconButton = ({ mr = false }: LoadingIconButtonProps) => {
  const styles = mr ? "mr-2" : "";

  return <ClipLoader size={12} color="white" className={styles} />;
};
export default LoadingIconButton;
