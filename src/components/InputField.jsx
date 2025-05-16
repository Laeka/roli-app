import React from 'react';

function InputField({ label, id, name, type = 'text', value, onChange, required = false, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor={id}>
        {label}:
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
        required={required}
        {...props} // Permite pasar otras props como placeholder, etc.
      />
    </div>
  );
}

export default InputField;
