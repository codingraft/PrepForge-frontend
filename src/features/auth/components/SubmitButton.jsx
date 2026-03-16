const SubmitButton = ({ label, loading = false }) => {
  return (
    <button type="submit" className="auth-submit" disabled={loading}>
      {loading ? <span className="spinner" /> : label}
    </button>
  );
};

export default SubmitButton;
