import { Navigate, useParams, useSearchParams } from "react-router-dom";

const BlocoInfo = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date") || "";
  return <Navigate to={`/bloco-detalhe/${id}?date=${date}`} replace />;
};

export default BlocoInfo;
