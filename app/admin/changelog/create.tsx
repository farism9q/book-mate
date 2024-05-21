import { UploadImage } from "@/components/upload-image";
import { ChangelogCategory } from "@prisma/client";
import { useState } from "react";
import {
  SaveContextProvider,
  SelectArrayInput,
  SimpleForm,
  TextInput,
  required,
  useCreate,
} from "react-admin";

export const ChangelogCreate = () => {
  const [create] = useCreate("changelog", { data: {} });

  const [images, setImages] =
    useState<{ imageUrl: string; imageKey: string }[]>();

  const handleOnCompeteUpload = (
    res: { imageUrl: string; imageKey: string }[]
  ) => {
    setImages(imgs =>
      res.map(r => ({ imageUrl: r.imageUrl, imageKey: r.imageKey }))
    );
  };

  const categories = Object.values(ChangelogCategory).map(category => ({
    name: category,
    id: category,
  }));

  // Need to do it in this way to pass the images url to json body
  const onSave = async (data: any) => {
    data.images = images?.map(image => ({
      imageUrl: image.imageUrl,
      imageKey: image.imageKey,
    }));


    await create("changelog", { data });
  };

  return (
    <SaveContextProvider value={{ save: onSave }}>
      <SimpleForm>
        <TextInput source="title" validate={[required()]} label="Title" />
        <TextInput
          source="description"
          validate={[required()]}
          label="Description"
        />
        <SelectArrayInput source="categories" choices={categories} />
        <UploadImage
          onChange={handleOnCompeteUpload}
          endpoint="imageUploader"
          maxFiles={6}
        />
      </SimpleForm>
    </SaveContextProvider>
  );
};
