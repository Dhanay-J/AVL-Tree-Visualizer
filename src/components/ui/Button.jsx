import PropTypes from 'prop-types';

export const Button = ({ onClick, children, className = "" }) => {
    return (
      <button
        onClick={onClick}
        className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition ${className}`}
      >
        {children}
   </button>
    );
  };

  Button.propTypes = {
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
  };