export default async (db: any, id: string) => {
  const query = 'SELECT * FROM public.users WHERE uid=$1';
  try {
    const data = await db.any(query, id);
    return data;
  } catch (error) {
    console.log(error.message);
  }
};
