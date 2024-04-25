interface TextoBuenoMaloProps {
  /** Se evalua como Truthy/Falsy */
  estaBueno: any;
  texto: string;
}

export const TextoBuenoMalo: React.FC<TextoBuenoMaloProps> = ({ estaBueno, texto }) => {
  const estaBuenoBoolean = !!estaBueno;

  return (
    <div>
      {estaBuenoBoolean ? (
        <p className="mb-2 text-success">
          <i className="bi bi-check2 me-2"></i>
          <span>{texto}</span>
        </p>
      ) : (
        <p className="mb-2 text-danger">
          <i className="bi bi-x-lg me-2"></i>
          <span>{texto}</span>
        </p>
      )}
    </div>
  );
};
