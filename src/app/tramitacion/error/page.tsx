const ErrorPage = () => {
  return (
    <div className="me-5 ms-5">
      <div className="text-center">
        <h1>
          <i style={{ fontSize: '72px' }} className="bi bi-exclamation-diamond text-warning"></i>
        </h1>
        <p>
          <b>Licencia ya se encuentra en proceso de tramitación.</b>
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
