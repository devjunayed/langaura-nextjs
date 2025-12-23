"use server";
export const UploadImage = async (formData: FormData) => {
  try {
    const response = await fetch("http://localhost:3000/api/upload-image", {
      method: "POST",

      body: formData,
    });
    const data = await response.json();

    return {data};
  } catch (error) {
    console.error({ error });
  }
};
