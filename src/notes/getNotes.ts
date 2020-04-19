export default async (db: any, userId: string) => {
  const notesQuery = `SELECT picture, json_agg(note.*) AS notes FROM public.notes
INNER JOIN public.note ON notes.uid = note.note_uid
WHERE user_id=$1
GROUP BY notes.uid`;
  try {
    const notesData = await db.any(notesQuery, userId);
    return notesData;
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
};
