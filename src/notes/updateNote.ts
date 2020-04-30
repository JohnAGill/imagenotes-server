import pgp from 'pg-promise';

export default async (db: any, notes: any) => {
  console.log(notes);
  const pgpRun = pgp({
    capSQL: true,
  });
  const cs = new pgpRun.helpers.ColumnSet(['value', '?uid'], { table: { table: 'note', schema: 'public' } });
  console.log(cs);
  const test = pgpRun.helpers.update(notes, cs) + ' WHERE v.uid = t.uid';

  console.log(test);

  try {
    await db.none(test, { values: notes });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
