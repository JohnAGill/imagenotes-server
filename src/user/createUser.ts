export default async (db: any, values: any) => {
  const query = `INSERT INTO public.users(
	"email", "userName", "uid")
	VALUES ($(values.email), $(values.userName), $(values.uid));`;
  try {
    await db.none(query, { values: values });
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
