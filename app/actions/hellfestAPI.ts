'use server';

export const getHellfestData = async () => {
  const url = process.env.NEXT_PUBLIC_HF_API_URL as string;
  const res = await fetch(url);
  const data = await res.json();
  return data;
};
