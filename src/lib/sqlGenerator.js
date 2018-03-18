function buildReplace(current, word, replacement) {
  return `REPLACE(${current}, "${word}", "${replacement}")`;
}

function buildSelect(words) {
  const base = "SELECT CONCAT('UPDATE ', table_schema,'.',table_name, ' SET ', column_name, '=";
  let current = '\', column_name,\'';

  Object.keys(words).forEach((word) => {
    current = buildReplace(current, word, words[word]);
  });

  return `${base}${current};')`;
}

function buildWhereSchema(schemas) {
  if (!schemas.length) {
    return '1=1';
  }

  return schemas.map(schemaName => `table_schema = '${schemaName}'`).toString().replace(/,/g, ' OR ');
}

function buildWhere(schemas) {
  return `WHERE (${buildWhereSchema(schemas)}) AND (
    column_type LIKE 'char(%'
    OR column_type LIKE 'varchar(%'
    OR column_type LIKE '%text'
  )`;
}

function sqlGenerator(wordsToReplaceObject, schemasArray) {
  return `
    ${buildSelect(wordsToReplaceObject)} 
    FROM information_schema.columns 
    ${buildWhere(schemasArray)};
  `;
}

export default sqlGenerator;
