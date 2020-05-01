import pgp from 'pg-promise';

export default async (db: any, note: any) => {
  const pgpRun = pgp({
    capSQL: true,
  });
  const cs = new pgpRun.helpers.ColumnSet(['value', 'note_uid', 'x', 'y', 'order', 'uid', 'text_color'], { table: { table: 'note', schema: 'public' } });
  const notesQuery = `INSERT INTO public.notes(
	"picture", "uid", "user_id")
  VALUES ($(values.picture), $(values.uid), $(values.user_id));`;
  const test = pgpRun.helpers.insert(note.notes, cs);
  try {
    console.log('wow');
    await db.none(notesQuery, { values: note });
    console.log('big wow');
    await db.none(test);
    console.log('mega wow');
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
};
