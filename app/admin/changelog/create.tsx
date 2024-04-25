import { deleteImage } from "@/actions/uploadthing";
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
import { ClientUploadedFileData } from "uploadthing/types";

export const ChangelogCreate = () => {
  const [create] = useCreate("changelog", { data: {} });

  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] =
    useState<{ imageUrl: string; imageKey: string }[]>();
  const [error, setError] = useState("");

  const handleOnCompeteUpload = (res: ClientUploadedFileData<null>[]) => {
    setImages(res.map(r => ({ imageUrl: r.url, imageKey: r.key })));
    setIsUploading(false);
  };

  const categories = Object.values(ChangelogCategory).map(category => ({
    name: category,
    id: category,
  }));

  const handleOnUploadError = (error: Error) => {
    setError(error.message);
  };

  const handleImageCancel = async (idx: number) => {
    if (images === undefined) return;
    setIsDeleting(true);
    await deleteImage(images[idx].imageKey);
    setIsDeleting(false);
    setImages(images?.filter((_, index) => index !== idx));
  };

  // Need to do it in this way to pass the images url to json body
  const onSave = async (data: any) => {
    data.images = images;

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
          onUploadComplete={handleOnCompeteUpload}
          onUploadError={handleOnUploadError}
          onUploadBegin={() => setIsUploading(true)}
          onImageCancel={handleImageCancel}
          endpoint="imageUploader"
          isUploading={isUploading}
          images={images}
          isDeleting={isDeleting}
          error={error}
        />
      </SimpleForm>
    </SaveContextProvider>
  );
};
