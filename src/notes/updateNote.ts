export default async (db: any, values: any) => {
  console.log(values);
  const notesQuery = `UPDATE public.note
    SET  value = $(update.text)
    WHERE  uid = $(update.uid)
`;
  try {
    await db.none(notesQuery, { update: values });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
};
