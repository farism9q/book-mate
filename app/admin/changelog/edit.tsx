import { UploadImage } from "@/components/upload-image";
import { ChangelogCategory } from "@prisma/client";
import { useState } from "react";
import {
  SaveContextProvider,
  SelectArrayInput,
  SimpleForm,
  TextInput,
  required,
  useGetOne,
  useGetRecordId,
  useUpdate,
} from "react-admin";
import { ClientUploadedFileData } from "uploadthing/types";

export const ChangelogEdit = () => {
  const recordId = useGetRecordId();

  const { data: changelog, isLoading } = useGetOne("changelog", {
    id: recordId,
  });

  const [update] = useUpdate("changelog", { id: recordId, data: {} });

  const [images, setImages] = useState<
    { imageUrl: string; imageKey: string }[] | undefined
  >(() => {
    if (changelog) {
      return changelog.images.map(
        (image: { imageUrl: string; imageKey: string }) => ({
          imageUrl: image.imageUrl,
          imageKey: image.imageKey,
        })
      );
    }
    return undefined;
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const categories = Object.values(ChangelogCategory).map(category => ({
    name: category,
    id: category,
  }));

  const handleOnCompeteUpload = (res: ClientUploadedFileData<null>[]) => {
    setImages(res.map(r => ({ imageUrl: r.url, imageKey: r.key })));
  };

  // Need to do it in this way to pass the images url to json body
  const onSave = async (data: any) => {
    data.images = images;

    await update("changelog", { data });
  };
  return (
    <SaveContextProvider value={{ save: onSave }}>
      <SimpleForm>
        <TextInput
          source="title"
          validate={[required()]}
          label="Title"
          defaultValue={changelog.title}
        />
        <TextInput
          source="description"
          validate={[required()]}
          label="Description"
          defaultValue={changelog.description}
        />
        <SelectArrayInput
          source="categories"
          choices={categories}
          label="Catergories"
          defaultValue={changelog.categories}
        />
        <UploadImage
          onChange={handleOnCompeteUpload}
          maxFiles={6}
          endpoint="imageUploader"
          images={changelog.images}
        />
      </SimpleForm>
    </SaveContextProvider>
  );
};
