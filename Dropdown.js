export const Dropdown = ({ dataOption, setSelectedData, selectedData, id }) => (
  <select name="data" id={id} onChange={(e) => setSelectedData(e.target.value)}>
    {dataOption.map((value) => {
      return (
        <option value={value.name} selected={value.name === selectedData}>
          {value.name}
        </option>
      );
    })}
  </select>
);
