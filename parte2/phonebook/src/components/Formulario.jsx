import React from "react";

const Formulario = ({
  addPerson,
  newName,
  handlePersonChange,
  newphone,
  handlePhoneChange,
}) => {
  return (
    <>
      <form onSubmit={addPerson}>
        <div>
          name:{" "}
          <input type="text" value={newName} onChange={handlePersonChange} />
        </div>
        <div>
          phone:{" "}
          <input type="tel" value={newphone} onChange={handlePhoneChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

export default Formulario;
