import React from 'react';

const Words = (props) => {
  const { words, onAdd, onRemove } = props;

  return (
    <table className="asociative-words table">
      <thead>
        <tr>
          <th>Word</th>
          <th>Replacement</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody>
        {
          Object.keys(words).map(word => (
            <tr key={word}>
              <td><input type="text" defaultValue={word} /></td>
              <td><input type="text" defaultValue={words[word]} /></td>
              <td><span role="button" onClick={onRemove(word)}>X</span></td>
            </tr>
          ))
        }
        <tr key="add-btn"><td colSpan="2" > <button onClick={onAdd}>Add word</button></td></tr>
      </tbody>
    </table>
  );
};

export default Words;