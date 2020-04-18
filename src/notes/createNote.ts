const pgp = require('pg-promise')({
  capSQL: true,
});

export default async (db: any, note: any) => {
  const cs = new pgp.helpers.ColumnSet(['value', 'noteUid', 'x', 'y'], { table: { table: 'note', schema: 'public' } });
  const notesQuery = `INSERT INTO public.notes(
	"picture", "uid")
  VALUES ($(values.picture), $(values.uid));`;
  const test = pgp.helpers.insert(note.notes, cs);
  try {
    await db.none(notesQuery, { values: note });
    await db.none(test);
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
};
