import pgp from 'pg-promise';

export default async (db: any, note: any) => {
  const pgpRun = pgp({
    capSQL: true,
  });
  const cs = new pgpRun.helpers.ColumnSet(['value', 'note_uid', 'x', 'y', 'order'], { table: { table: 'note', schema: 'public' } });
  const notesQuery = `INSERT INTO public.notes(
	"picture", "uid", "user_id")
  VALUES ($(values.picture), $(values.uid), $(values.user_id));`;
  const test = pgpRun.helpers.insert(note.notes, cs);
  try {
    await db.none(notesQuery, { values: note });
    await db.none(test);
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
};
