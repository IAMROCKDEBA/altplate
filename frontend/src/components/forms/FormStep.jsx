const FormStep = ({ children, title, subtitle }) => {
  return (
    <div className="animate-slideUp">
      {title && (
        <div className="mb-6">
          <h3 className="text-2xl font-bold gradient-text mb-2">{title}</h3>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default FormStep;
