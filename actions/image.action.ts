"use server";
export const UploadImage = async (formData: FormData) => {
  try {
    const response = await fetch("http://localhost:3000/api/image", {
      method: "POST",

      body: formData,
    });
    const data = await response.json();

    return {data};
  } catch (error) {
    console.error({ error });
  }
};


export type TDeleteImage={public_id: string, signature: string}

export const DeleteImage = async(data: TDeleteImage) =>{
 try {
    const response = await fetch("http://localhost:3000/api/image", {
      method: "DELETE",
      body: JSON.stringify(data),
    });

    const result =  await response.json();

    return result;
   
  } catch (error) {
    console.error({ error });
  }
}